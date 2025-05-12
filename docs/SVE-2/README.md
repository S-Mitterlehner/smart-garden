# SVE - Übung 2 - Kommunikationsservices

## ASP.NET Backend

### Einleitung

Ein Ziel dieses Projekts war es, verschiedene Technologien zur Echtzeitkommunikation im Backend zu untersuchen und in einem praktischen Anwendungsfall zu kombinieren. Dazu wurden **SignalR** und **GraphQL Subscriptions mit Hot Chocolate** eingesetzt, jeweils als Alternativen zur klassischen REST-Architektur.

---

### SignalR – WebSocket-Kommunikation

**SignalR** ermöglicht serverseitiges Pushen von Nachrichten an Clients über WebSockets oder Fallbacks wie Long Polling.

Beispielhafte Nutzung:

```csharp
public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
{
    await context.Clients.All.SendAsync("Actuator_State", data.ActuatorKey, data.ActuatorType.ToString(), dto);
}
```

Vorteile:

* Ideal für einfache Broadcast-Kommunikation
* Direkter Zugriff auf verbundene Clients

---

### GraphQL Subscriptions mit Hot Chocolate

GraphQL Subscriptions bieten eine deklarative Möglichkeit, auf Ereignisse zu reagieren – ähnlich wie Queries, aber reaktiv.

Einrichtung der Subscription:

```csharp
[Subscribe]
[Topic(GraphQlActuatorListener.STATE_CHANGED)]
public ActuatorStateDto OnActuatorStateChanged([EventMessage] ActuatorStateDto data) => data;
```

Senden des Events:

```csharp
await eventSender.SendAsync(STATE_CHANGED, dto);
```

Vorteile:

* Saubere Integration in das bestehende GraphQL-Schema
* Filterung und Typsicherheit out-of-the-box

---

### SignalR und GraphQL Subscriptions parallel einsetzen

Beide Systeme lassen sich problemlos kombinieren, indem man eine Composite-Klasse verwendet, die beide Listener gleichzeitig bedient:

```csharp
public class ActuatorListenerComposite(params IActuatorListener[] listeners) : IActuatorListener
{
    public async Task PublishStateChangeAsync(ActuatorState data, IEnumerable<ActionDefinition> actions)
    {
        foreach (var l in listeners)
        {
            await l.PublishStateChangeAsync(data, actions);
        }
    }
}
```

Anwendungsfall:

* Unterschiedliche Clients (z. B. Browser mit GraphQL vs. native Apps mit SignalR) können gleichzeitig bedient werden.

---

### GraphQL Initialisierung im Backend

Die Initialisierung des GraphQL-Servers erfolgt in `Program.cs`:

```csharp
builder.Services.AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddMutationConventions(applyToAllMutations: true)
    .AddFiltering()
    .AddSorting()
    .AddInMemorySubscriptions();
```

Erklärung:

* `AddQueryType`, `AddMutationType`, `AddSubscriptionType` definieren die drei GraphQL-Grundtypen
* `AddInMemorySubscriptions` aktiviert Subscriptions via WebSocket
* `AddFiltering` und `AddSorting` ermöglichen dynamische Filter über die API

---

### GraphQL Subscriptions verwenden

Definition der Subscription-Methode:

```csharp
[Subscribe]
[Topic(GraphQlActuatorListener.STATE_CHANGED)]
public ActuatorStateDto OnActuatorStateChanged([EventMessage] ActuatorStateDto data) => data;
```

Verwendung von `ITopicEventSender` zum Senden:

```csharp
await eventSender.SendAsync(STATE_CHANGED, dto);
```

Erklärung:

* Die Subscription wird durch das Topic `"Actuator_State"` ausgelöst
* Die Methode liefert automatisch die gepublishten Daten an alle verbundenen Subscriber
* Spart Polling und reduziert Netzwerklast

Beispielaufruf:
```graphql
subscription {
  onActuatorStateChanged {
    actuatorKey
    actuatorType
    connectionState
    lastUpdate
    max
    min
    state
    stateType
    unit
    value
  }
}
```
Response:
```json
{
  "data": {
    "onActuatorStateChanged": {
      "actuatorKey": "sg-f0f5bd525a98",
      "actuatorType": "Pump",
      "connectionState": "Connected",
      "lastUpdate": "2025-05-12T19:23:28.772Z",
      "max": null,
      "min": null,
      "state": "Stopped",
      "stateType": "Discrete",
      "unit": null,
      "value": null
    }
  }
}
```

---

### GraphQL Queries – Definition und Nutzung

Eine Query ist eine lesende Anfrage an die API. Beispiel:

```csharp
public class Query
{
    [UseFiltering]
    public async Task<IEnumerable<ActuatorRefDto>> GetActuators([Service] ApplicationContext db)
        => await db.Get<ActuatorRef>().Select(ActuatorDto.FromEntity).ToListAsync();
}
```

Vorteile:

* Durch `[UseFiltering]` können Clients dynamisch nach Eigenschaften filtern (z. B. `type == "digital"`).
* Anfragen sind flexibel und effizient – der Client entscheidet, welche Felder er benötigt. Kein Overfetching wie bei REST.
* Queries können durch weitere Attribute wie `[UseSorting]`, `[UsePaging]` und `[UseProjection]` erweitert werden.

Beispielaufruf:
```graphql
query {
  actuators {
    description
    id
    key
    name
    type
  }
}
```
Response:
```json
{
  "data": {
    "actuators": [
      {
        "description": "Water pump is a device that moves water from one place to another. It is often used in irrigation systems.",
        "id": "f3948dbb-4c99-4173-86d6-3e24834639df",
        "key": "sg-48ca435508f0",
        "name": "Water Pump",
        "type": "Pump"
      },
      ...
    ]
  }
}
```

---

### GraphQL Mutations – Definition und Nutzung

Mutations sind schreibende Operationen. Beispiel:

```csharp
public class Mutation
{
    public async Task<ActuatorRef?> UpdateActuatorRef([ID] Guid id, string? name, string? description,
        [Service] ApplicationContext db)
    {
        var reference = await db.Get<ActuatorRef>().FirstOrDefaultAsync(x => x.Id == id);
        if (reference == null) throw new GraphQLException("Actuator not found.");

        if (name is not null) reference.Name = name;
        if (description is not null) reference.Description = description;

        await db.SaveChangesAsync();
        return reference;
    }
}
```

Erklärung:

* Mutationen erlauben gezielte Änderungen an Datenmodellen
* Durch optionale Parameter flexibel und fehlertolerant

Beispielaufruf:
```graphql
mutation {
  updateActuatorRef(input: { description: "new description", id: "8d78b0f2-2879-4fe9-a18c-5dddcb5c002e", name: "NewActuator" }) {
    actuatorRef {
      connectorKey
      description
      id
      isDeleted
      name
      order
      topic
      type
    }
  }
}
```
Response:
```json
{
  "data": {
    "updateActuatorRef": {
      "actuatorRef": {
        "connectorKey": "sg-f0f5bd525a98",
        "description": "new description",
        "id": "8d78b0f2-2879-4fe9-a18c-5dddcb5c002e",
        "isDeleted": false,
        "name": "NewActuator",
        "order": 2147483647,
        "topic": "smart-garden/sg-f0f5bd525a98/hatch",
        "type": "HATCH"
      }
    }
  }
}
```

---

### Lessons Learned

* GraphQL Subscriptions bieten eine elegante und typisierte Alternative zu SignalR – ideal in Frontend-lastigen Projekten
* Die Kombination beider Systeme ist mit minimalem Overhead möglich und sinnvoll bei heterogenen Client-Landschaften
* Die Hot Chocolate Library bietet exzellente Developer Experience.

---

### Review

Das Projekt zeigt, dass sich moderne Backend-Technologien wie GraphQL, Subscriptions und SignalR gut kombinieren lassen, um sowohl deklarative als auch imperative Kommunikationswege bereitzustellen.
Die Implementierung ist modular, wartbar und testbar, und ermöglicht skalierbare, reaktive Schnittstellen – ein klares Upgrade zu klassischen REST-only APIs.

