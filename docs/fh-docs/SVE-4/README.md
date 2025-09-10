# SVE - Übung 4 - Microservices

## Machbarkeitsstudie

### Auftrennen der API in einzelne Services

**Ziel:**

- Die Auftrennung einer monolithischen API in mehrere eigenständige Services ermöglicht eine bedarfsweise Skalierung.
- Beispielsweise kann im Projekt _Smart-Garden_ die `Beds`-API unabhängig vom restlichen System horizontal skaliert und repliziert werden, um der höherer Last besser standzuhalten.

**Schwierigkeiten:**

- Da sowohl die `Plants`-API als auch die `Beds`-API aktuell Teil eines gemeinsamen GraphQL-Services sind, erfordert die Auftrennung auch eine Aufteilung des GraphQL-Schemas.
- Um dem Frontend weiterhin einen einheitlichen Zugriffspunkt zu bieten, ist ein GraphQL API-Gateway erforderlich. Dieses führt die getrennten Schemata der Services wieder zusammen (Schema-Stitching oder Federation), sodass im Frontend weiterhin zentral Typen generiert (z. B. TypeScript-Klassen) und Anfragen an einen gemeinsamen Endpunkt geschickt werden können.
- Zusätzlich entsteht Mehraufwand im Deployment, Monitoring und bei der Fehleranalyse durch die erhöhte Komplexität des Systems.

### Replizieren von einzelnen API-Services

**Ziel:**

- Durch die Replikation von Services kann die Last auf mehrere Instanzen verteilt und damit die Verfügbarkeit sowie die Performance gesteigert werden.

**Schwierigkeiten:**

- Bei der Replikation zustandsloser HTTP-Endpunkte entstehen in der Regel keine Probleme.
- Komplexer wird es bei Stateful-Komponenten wie Websockets oder GraphQL Subscriptions:
  - Da Nachrichten z. B. über RabbitMQ verteilt werden, aber immer nur eine Instanz (ein Replikat) eine bestimmte Nachricht konsumiert, erhalten nur die Clients, die mit genau dieser Instanz verbunden sind, die entsprechenden Updates.
  - Die anderen Replikas (und damit die mit ihnen verbundenen Clients) erhalten die Nachricht nicht, was zu inkonsistenten UI-Zuständen im Frontend führen kann.
  - Eine mögliche Lösung wäre der Einsatz eines gemeinsamen Publish/Subscribe-Mechanismus oder ein Message-Broker mit Fanout-Exchange, sodass alle relevanten Replikas die Nachricht erhalten und an ihre Clients weiterleiten können.

### Einführung eines API-Gateways

**Ziel:**

- Die Auftrennung und Replizierung der Apis führt automatisch zu mehreren Hosts und Endpunkten. Um dies zusammenzufassen muss ein API-Gateway geschaffen werden
- Durch die Auftrennung der Apis wurde ebenfalls das GraphQL Schema aufgeteilt. Dies muss mittels GraphQL Federation wieder zusammengeführt, bzw. die Requests aufgeteilt werden.

**Anforderungen:**

- Um ein einfaches Betreiben der Software auf einen Server zu ermöglichen, soll das Routing des Gateways über die Route erfolgen. Bspw. soll `http://gateway/api/beds/swagger` auf `http://beds-api/swagger` zugreifen.

**Schwierigkeiten:**

- Die Endpunkte auf welche das Frontend zugreift müssen vom API-Gateway transformiert und bei Weiterleitungen zurücktransformiert werden.
- Die Weiterleitung von Web-Sockets für den GraphQL Gateway gestaltet sich schwierig, da keine Implementierung von GraphQL-Federation Server Web-Sockets und somit GraphQL-Subscriptions erlauben/zulassen.

### Polyglott Persistence

**Ziel**:

- Jeder Service hat seine eigene Datenbank wo er servicerelevante Daten speichert.
- Die Skalierung der einzelnen Komponenten ist einfacher möglich.

**Schwierigkeiten**

- Datenbanken bei replizierten Services dürfen nur einmal geseeded werden. Ein DistributedLock ist dafür erforderlich, was eine geteilte Datenbank (Redis) erfordert.
- Manche Services brauchen die gleichen Daten -> Synchronisierungsläufe sind dabei ggf. erforderlich.

### Replizieren von Background-Services

**Ziel**:

- Auch Background-Services, wie der `ConnectorService` können repliziert werden, damit die Workload für mehrere Sensoren aufgeteilt werden kann.

**Anforderungen**:

- Ein Service soll lediglich Nachrichten einer kleinen Gruppe von Sensoren verarbeiten.
- Ein Sensor soll nur von einem Service verarbeitet werden.
- ConnectorServices sollen dynamisch je nach Anzahl der verfügbaren Module erzeugt werden.

**Schwierigkeiten**:

- Eine dynamische Generierung von Services ist mittels Aspire momentan nicht möglich. Dieser Punkt wird daher nicht weiter verfolgt

### Fehlerresistenz mit Polly

Im Rahmen der Evaluierung von Fehlerbehandlungsstrategien wurden die Möglichkeiten der Bibliothek Polly untersucht, insbesondere im Hinblick auf die Umsetzung von Retry, Circuit Breaker und Timeout-Mechanismen.

Da im Kontext unseres Projekts vor allem Sensordaten verarbeitet werden, die in regelmäßigen Zyklen aktualisiert werden, wurde der Verlust einzelner Datenpakete als nicht kritisch eingestuft. Die Wiederholung fehlgeschlagener Anfragen würde daher keinen wesentlichen Mehrwert bringen, sondern unter Umständen sogar unnötige Systemlast erzeugen.

Aus diesem Grund wurde entschieden, Polly nicht weiter zu integrieren, da für unser Einsatzszenario keine sinnvollen Anwendungsfälle identifiziert werden konnten.

---

## Architektur

Die Anwendung soll in drei Microservices aufgeteilt werden, die jeweils einen bestimmten Geschäftsbereich abbilden (z. B. Pflanzenverwaltung, Beete, Auth). Die Kommunikation erfolgt über ein API-Gateway, welches mittels YARP oder NGINX implementiert werden soll. Die Services laufen lokal unter Aspire, können aber auch containerisiert und auf Azure deployed werden. Monitoring und Konfiguration sind vollständig in Aspire integriert.

![Architekturübersicht](./img/Architecture.png)

## API-Gateway

### YARP (Yet Another Reverse Proxy)

#### YARP mit .NET Aspire

Ab .NET Aspire Preview 3 kann YARP direkt als Ressource eingebunden werden. Aspire erkennt automatisch, welche Services verfügbar sind, und kann auf diese über `WithReference()` weiterleiten.

Dies vereinfacht die Konfiguration deutlich, da Aspire die DNS-Namen der Microservices auflöst und in der Laufzeitumgebung registriert.

```cs
builder.AddYarp("gateway")
    .WithConfigFile("yarp.json")
    .WithReference(bedApi)
    .WithReference(plantApi)
    .WithHttpEndpoint(5000, 5000, name: "httpgateway");
```

#### Beispielkonfiguration: `yarp.json`

```json
{
  "ReverseProxy": {
    "Routes": {
      "beds": {
        "ClusterId": "bedsApiCluster",
        "Match": { "Path": "/api/beds/{**catch-all}" },
        "Transforms": [
          { "PathRemovePrefix": "/api/beds" }
        ]
      },
      "plants": { ... }
    },
    "Clusters": {
      "bedsApiCluster": {
        "LoadBalancingPolicy": "RoundRobin",
        "Destinations": {
          "beds/d1": {
            "Address": "http://bed-api/"
          }
        }
      },
      "plantsApiCluster": { ... }
    }
  }
}
```

**Hinweis:** Obwohl die Grundkonfiguration funktioniert, gab es Schwierigkeiten bei speziellen Anfragen wie GraphQL-POSTs mit Redirects. Daher wurde ergänzend mit einer YARP Konfiguration in einem klassischen Gateway-Projekt getestet.

#### YARP mit .NET Konfigurationsprojekt

Als Alternative zur Konfiguration über JSON kann YARP auch manuell als eigenständiges ASP.NET Core-Projekt eingerichtet werden. Diese Methode bietet größere Kontrolle über Aspekte wie Authentifizierung, CORS, Weiterleitungen oder benutzerdefinierte Middleware.

Folgendes Beispiel zeigt eine typische YARP-Konfiguration per C#-Code in einem Konfigurationsprojekt. Die HTTP-Routen (`/api/beds/...`, `/api/plants/...`) auf interne Cluster (`bed-api`, `plant-api`) weiterleitet, inklusive statischer Zieladressen und fixer Pfadmuster.

```cs
using System.Collections.ObjectModel;
using Microsoft.Extensions.Primitives;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;

namespace SmartGarden.Gateway;

public class Config : IProxyConfigProvider
{
    public IProxyConfig GetConfig() => new ProxyConfig();
}

public class ProxyConfig : IProxyConfig
{
    public IReadOnlyList<RouteConfig> Routes =>
    [
        new RouteConfig
        {
            Match = new RouteMatch
            {
                Path = "/api/beds/{**catch-all}"
            },
            Metadata = new Dictionary<string, string>
            {
                {"prefix", "/api/beds"}
            }
        }
    ];

    public IReadOnlyList<ClusterConfig> Clusters => [
        new ClusterConfig
        {
            ClusterId="beds",
            Destinations = new Dictionary<string, DestinationConfig>
            {
                {
                    "beds/d1", new DestinationConfig
                    {
                        Address = "http://bed-api/"
                    }
                },
                {
                    "plants/d1", new DestinationConfig
                    {
                        Address = "http://plant-api/"
                    }
                }
            }
        }
    ];

    public IChangeToken ChangeToken => new CancellationChangeToken(CancellationToken.None);
}
```

Die Dienstnamen wie `http://bed-api/` oder `http://plant-api/` werden durch .NET Aspire automatisch aufgelöst. Dadurch entfällt die manuelle Pflege von IP-Adressen oder Ports, die Kommunikation zwischen Diensten wird vereinfacht und zentralisiert.

Neben der Routen-Weiterleitung lassen sich mit YARP auch benutzerdefinierte Transformationen umsetzen. Für Smart-Garden wird z.B. das Problem gelöst, dass GraphQL-Server üblicherweise ein `/graphql/` mit Trailing Slash erwarten:

```cs
public class GraphQLPathFixer : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (context.Request.Path.Value is not null && context.Request.Path.Value.ToLower().EndsWith("/graphql"))
        {
            context.Response.Clear();
            context.Response.StatusCode = StatusCodes.Status301MovedPermanently;
            context.Response.Headers.Location = context.Request.Path.Value + "/";
            return;
        }

        await next(context);
    }
}
```

In .NET Aspire wird das Gateway wie folgt eingebunden und referenziert automatisch andere Dienste:

```cs
builder.AddProject<SmartGarden_Gateway>("gateway")
       .WithReference(plantApi)
       .WithReference(bedApi)
       .WithReference(authApi)
       .WithReference(frontend)
       .WithReference(graphQL)
       .WaitFor(bedApi)
       .WaitFor(plantApi)
       .WithExternalHttpEndpoints();
```

### NGINX

#### NGINX lokal unter Linux

NGINX kann sehr einfach als API-Gateway genutzt werden. Dabei werden Anfragen anhand des Pfades (z. B. `/api/beds/...`) umgeschrieben und an die entsprechenden lokalen Services weitergeleitet.

...

```
worker_processes 1;

events { worker_connections 1024; }

http {
    # HTTP-Backends
    upstream beds_backend {
        server 127.0.0.1:5206;
    }

    # HTTPS-Backends
    upstream beds_backend_https {
        server 127.0.0.1:7248;
    }

    ...

    # HTTP
    server {
      ...
    }

    # HTTPS
    server {
        listen 8081;

        location ~ ^/api/beds(/.*)?$ {
            rewrite ^/api/beds(/.*)?$ $1 break;
            proxy_pass https://beds_backend_https;
            proxy_ssl_verify off;
        }

        ...

        location / {
            return 404;
        }
    }
}
```

#### NGINX in Docker mit Aspire

Ein Containerbetrieb wurde versucht, jedoch traten bei POST-Requests (z. B. GraphQL) Fehler auf. Grundproblem: Kommunikation vom Container zu lokalen Diensten.

Grundsätzlich hat das Aufrufen von gehosteten Services funktioniert (Bsp. `localhost:8080/api/beds/swagger/index.html` oder `localhost:8080/api/beds/graphql/`) allerdings gab es trotz richtiger Weiterleitung Einschränkungen bei spezifischen POST-Anfragen. Daher wurde dieser Weg nicht weiter verfolgt.

**Wichtige Erkenntnisse:** Lokale Dienste müssen aus dem Docker Container über `host.docker.internal:<port>` angesprochen werden.

### GraphQL - Apollo Gateway

Da aufgrund der Architektur die GraphQL-Zuständigkeiten auf mehrere Microservices verteilt wurden (z. B. `beds`, `plants`), wird ein zentraler GraphQL-Endpunkt benötigt, der diese Dienste zusammenführt.
Dies wird mit Hilfe von Apollo Gateway und dem Konzept der GraphQL Federation realisiert.

Das Gateway nutzt das Tool `IntrospectAndCompose`, um die Schemas der Subgraphen dynamisch abzurufen und daraus ein sogenanntes Supergraph-Schema zu erzeugen. Dieses Schema steht dann unter einem einzigen Endpunkt (`/graphql`) bereit.

Bei einer Anfrage entscheidet der Gateway anhand der Felder und Typen, welcher Subgraph zuständig ist, leitet die Anfrage weiter und führt das Ergebnis zusammen, bevor es an den Client geht.

**Beispielimplementierung**

```ts
const { ApolloServer } = require("apollo-server");
const { ApolloGateway, IntrospectAndCompose } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "beds", url: "http://localhost:5206/graphql/" },
      { name: "plants", url: "http://localhost:5117/graphql/" },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
  cors: { origin: "*" },
});

server.listen(5100).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
```

Apollo Gateway bietet einen zentralen Zugriffspunkt für verteilte GraphQL-Services, führt deren Schemas automatisch zu einem gemeinsamen Schema zusammen und ermöglicht so eine starke Entkopplung von Frontend und einzelnen Backend-Services.

## Replizieren von Apis

Um die Performance und Ausfallsicherheit noch weiter zu erhöhen, soll vor allem die neu geschaffene `Beds-API` repliziert werden können.
In der aktuellen Version sollen diese Apis jedoch auf die gleiche Datenbank-Instanz zugreifen. Daher müssen vor allem für das Seeding der Datenbank eine verteilte Variante implementiert werden, da es ansonsten zu Inkonsistenzen oder fehlerhaftem Verhalten kommen kann.

Zu diesem Zweck wird die Bibliothek `DistributedLock` verwendet, die z. B. auf der bereits integrierten Redis-Datenbank basiert. Sie ermöglicht das Setzen von Sperren, um gleichzeitige Schreibzugriffe beim Seeding zuverlässig zu unterbinden.

Die eigentliche Replikation eines Services lässt sich mit Aspire sehr einfach umsetzen: Durch den Aufruf von `.WithReplicas(...)` beim Hinzufügen des Projekts kann die gewünschte Anzahl an Instanzen definiert werden.

```cs
var bedApi = builder.AddProject<SmartGarden_Api_Beds>("bed-api")
    .WithReference(dbBedApi)
    .WithReference(rabbitmq)
    .WithReference(redis)
    .WithReference(authApi)
    .WaitFor(dbBedApi)
    .WaitFor(rabbitmq)
    .WaitFor(redis)
    .WithExternalHttpEndpoints();
    .WithReplicas(3);
```

Ein wesentlicher Nachteil von Aspire ist jedoch, dass die Replikate nicht dynamisch zur Laufzeit skaliert werden können. Die Anzahl der Instanzen muss bereits beim Start festgelegt werden, was die Flexibilität des Systems zur Laufzeit deutlich einschränkt.

## Lessons Learned und Review

**.NET Aspire** bietet einen starken Entwicklungsstack für Microservices und eignet sich aktuell primär für lokale Entwicklung, Testumgebungen oder Projekte mit Azure-Integration. Zu Beginn der Entwicklung ermöglicht Aspire sehr schnelles Setup neuer Services inklusive Datenbankanbindung und Kommunikation zwischen Diensten, vieles davon funktioniert automatisch und mit minimalem Konfigurationsaufwand. In komplexeren Architekturen stößt man jedoch rasch an Grenzen, z.B. bei dynamischem Service-Scaling oder bei der Ausführung in Container-Umgebungen. Besonders das Deployment außerhalb von Azure (z.B. in Docker oder Kubernetes) ist derzeit nur eingeschränkt möglich und erfordert Workarounds.

**YARP (Yet Another Reverse Proxy)** funktioniert "out of the box" sehr gut für einfache Routing-Szenarien. Besonders in Kombination mit .NET Aspire kann es schnell eingebunden werden. Für komplexere Anforderungen (wie z.B. bei GraphQL, CORS-Handling oder feingranularen Weiterleitungen) stößt man mit dem Aspire Package jedoch schnell an funktionale Grenzen, dafür eignet sich ein eigenes YARP-Konfigurationsprojekt.

**NGINX** hat sich als gute Lösung für den API-Gateway erwiesen. Es bietet eine fein einstellbare Konfiguration und eignet sich besonders für produktive Umgebungen mit speziellen Anforderungen. Die Einarbeitung ist aufgrund der vielen Konfigurationsmöglichkeiten aufwendiger als bei YARP, aber man profitiert langfristig von deutlich mehr Flexibilität.

**Docker + Netzwerkzugriffe** stellten eine Herausforderungen dar. Vor allem beim Zugriff von Containern auf Dienste auf dem Host-System oder aufeinander mussten spezielle Netzwerkkonfigurationen berücksichtigt werden (z.B. `host.docker.internal`, benutzerdefinierte Docker-Netzwerke).

**Entwicklungsworkflow**: Aspire + .NET + Redis + RabbitMQ + GraphQL + API-Gateway + Frontend ist mächtig, aber komplex. Die Toolchain erfordert gutes Verständnis für Zusammenhänge und Lebenszyklen der einzelnen Services.

Persönlich würden wir, sofern nicht zwingend notwendig, so lange wie möglich bei einer monolithischen Architektur bleiben. Diese lässt sich deutlich einfacher aufsetzen, warten und erweitern. Für viele Use Cases reicht ein gut strukturierter Monolith aus, vor allem in frühen Projektphasen oder bei kleineren Teams. Microservices bringen zwar Skalierbarkeit und Flexibilität, aber auch hohe Komplexität in Bezug auf Deployment, Monitoring, Servicekommunikation, Datenhaltung und Fehleranalyse.