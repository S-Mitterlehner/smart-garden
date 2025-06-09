# SVE - Übung 4 - Microservices

## Betätigungsfelder

TODO Remove:
- Service Discovery: -
- API-Gateway: YARP
- Security: -
- Microservice-Anwendungen:
  - Replicas of API
- Ausfallssicherheit:
  - Replicas of API
  - Polly -> ??
- Monitoring:
  - Aspire
- CI/CD Pipeline:
  - Github Actions
- Betrieb einer Microservice-Anwendung:
  - Deployment to Azure Container Services
- Microservice-Architekturen: -
- Polyglott Persistence: Verteilte Datenbanken + Datenbankentechnologien (Redis, Postgres)

## Architektur

Die Anwendung ist in zwei neue zentrale Microservices aufgeteilt, die jeweils einen bestimmten Geschäftsbereich abbilden (z. B. Pflanzenverwaltung, Beete). Die Kommunikation erfolgt über ein API-Gateway, wahlweise via YARP oder NGINX. Die Services laufen lokal unter Aspire, können aber auch containerisiert und auf Azure deployed werden. Monitoring und Konfiguration sind vollständig in Aspire integriert.

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

TODO ...

Als Alternative kann YARP auch manuell als eigenständiges ASP.NET Core Projekt aufgesetzt werden. Dies gibt mehr Kontrolle über z. B. Authentifizierung, CORS oder Weiterleitungen.

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
var app = builder.Build();
app.MapReverseProxy();
app.Run();
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


## Monitoring mit .NET Aspire

TODO ???

Mit `.NET Aspire` steht ein integriertes Dashboard zur Verfügung, das alle gestarteten Dienste überwacht.

TODO Screenshots ...



## Fehlertoleranz mit Polly

TODO ???

Für HTTP-Clients wurde **Polly** eingesetzt, um Retry-Strategien bei Fehlern umzusetzen. Dies erhöht die Resilienz gegenüber kurzfristigen Ausfällen (z. B. bei der Datenbank oder anderen Services).

-> Bei Bedarf können auch Circuit Breaker und Timeout-Policies integriert werden.

## Lessons Learned und Review

TODO ??

* `.NET Aspire` bietet einen starken Entwicklungsstack für Microservices, eignet sich aber aktuell primär für **lokale Entwicklung und Testumgebungen**.
* **YARP** funktioniert out-of-the-box für einfache Routing-Szenarien, hat aber bei komplexeren Anwendungen (GraphQL, CORS) noch Schwächen.
* **NGINX** ist flexibel und stabil, wenn detaillierte Kontrolle über HTTP-Verhalten erforderlich ist.
* **Docker + Netzwerkzugriffe** erfordern besondere Beachtung. Der Zugriff von Containern auf lokale Dienste war nicht trivial und sorgte für Herausforderungen.