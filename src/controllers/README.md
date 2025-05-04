# Controller

## Getting Started

In order to make every script working properly, you need to create a new file `arduino_secrets.h` which is not comitted into the repo.

The content of this file should look like this:

```cpp
#define SECRET_SSID "yourwifissid"
#define SECRET_PASS "yourwifipw"
```

## Module 1

### Dependencies

Install the following dependencies by the exact name

- "PubSubClient"
- "ArduinoJson"
- "DHT sensor library"
- "AccelStepper"
