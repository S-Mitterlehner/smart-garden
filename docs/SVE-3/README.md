# SVE - Übung 3 - Message-oriented Middleware

## Einleitung

Ziel dieser Übung war die Entwicklung eines verteilten Systems, das auf dem Prinzip der *Message-oriented Middleware* basiert. Im Zentrum steht RabbitMQ als Messaging Broker, über den verschiedene Services lose gekoppelt miteinander kommunizieren können. Als Szenario dient ein modulares Smart-Garden-System, in dem Sensoren und Aktoren über MQTT angebunden sind, Automatisierungsregeln verarbeitet werden und ein Frontend die Benutzerinteraktion ermöglicht.

---

## Architektur

### Gesamtübersicht

Die folgende Abbildung zeigt die beteiligten Services und deren Zusammenspiel, sowie die jeweils verwendeten Datenbanken:

![Architekturübersicht](./img/Architecture.png)

### Message-Flows

Die Kommunikation zwischen den Services erfolgt asynchron über RabbitMQ. Der Informationsaustausch ist in folgende Message-Typen untergliedert:

* **ConnectorService**

  * Empfängt MQTT-Nachrichten von Modulen:

    * *RegisterMessage*: Modul meldet sich neu an
    * *ModuleStateMessage*: Modul übermittelt aktuelle Zustände oder Messwerte
  * Sendet Aktionen über MQTT an Module, um Aktoren zu steuern
  * Leitet empfangene Nachrichten per RabbitMQ an die **Backend-API** und den **AutomationService** weiter

* **Backend-API**

  * Empfängt *RegisterMessages* zur Anzeige neu registrierter Module im Frontend
  * Empfängt *ModuleStateMessages* zur Darstellung aktueller Sensor- und Aktorwerte
  * Sendet *ActionExecutionMessages* an den ConnectorService, wenn der Benutzer im Frontend eine Aktion auslöst
  * Sendet *AutomationRuleMessages* an den AutomationService, wenn neue Regeln konfiguriert werden

* **AutomationService**

  * Erhält *AutomationRuleMessages* von der API zur Speicherung und zyklischen Auswertung
  * Erhält *ModuleStateMessages* vom ConnectorService zur Regelüberprüfung
  * Sendet *ActionExecutionMessages* an den ConnectorService, wenn eine Regel greift

Das folgende Diagramm visualisiert diese Nachrichtenflüsse:

![Message-Fluss](./img/Message_Diagram.png)

---

## RabbitMQ Architektur

Für jeden Message-Typ wurde eine eigene **Exchange** definiert. Diese Entscheidung wurde bewusst getroffen, da keine Notwendigkeit besteht, Nachrichten thematisch über Topics zu bündeln oder zu filtern. So bleibt die Struktur übersichtlich.

Im folgenden RabbitMQ-Diagramm sind auf der linken Seite die **Producer**, auf der rechten Seite die **Consumer** zu sehen:

![RabbitMQ-Diagramm](./img/RabbitMQ_Diagram.png)

---

## Services

### ConnectorService

Der ConnectorService stellt die Schnittstelle zwischen dem MQTT-basierten Modulnetzwerk und der RabbitMQ-basierten Middleware dar. Er verarbeitet eingehende MQTT-Nachrichten (Registrierung, Statusupdates) und gibt diese über RabbitMQ an andere Services weiter. Zudem nimmt er Steuerbefehle entgegen und sendet diese über MQTT an die entsprechenden Module.

### AutomationService

Dieser Service verwaltet Automatisierungsregeln, die vom Benutzer über das Frontend konfiguriert werden. Er überwacht zyklisch die Zustände aller registrierten Module, die über RabbitMQ empfangen werden, und löst beim Auslösen einer Regel entsprechende Steuerbefehle aus.

### Backend-API

Die API bildet die Schnittstelle zum Frontend. Sie sorgt für die Bereitstellung der aktuellen Modulzustände und ermöglicht die Konfiguration von Automatisierungsregeln sowie das direkte Steuern von Aktoren. Die API ist sowohl Consumer als auch Producer für mehrere Message-Typen innerhalb von RabbitMQ.

---

## Implementierung

...



## Lessons Learned und Review

...
