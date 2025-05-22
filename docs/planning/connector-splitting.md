# Connector Splitting

## Goal

Split the implentation of the Connectors, so that the ExecutionService (or ConnectionService) can work as a standalone micro-service that communicates via RabbitMQ.

## Splitting

**Shared**:

- Key
- Type
- GetActions
- GetStateAsync -> Different Implementation Tho

**API**

- Name
- Description
- GetAutomationConfigAsync

**ExecutionService**

- Topic
- ExecuteAction
- InitializeAsync
