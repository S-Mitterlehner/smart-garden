#ifndef ACTUATOR_MANAGER_H
#define ACTUATOR_MANAGER_H

#include <ArduinoJson.h>
#include <PubSubClient.h>
#include "utils.h"
#include "Component.h"

#define MAX_ACTUATORS 10
#define ACTUATOR_REGISTER_TOPIC "smart-garden/register"
#define ACTION_MESSAGE_TYPE "Action"

class ActuatorManager {
private:
  Actuator* actuators[MAX_ACTUATORS];
  int actuatorCount = 0;

public:
  void addActuator(Actuator* actuator) {
    if (actuator && actuatorCount < MAX_ACTUATORS) {
      actuators[actuatorCount++] = actuator;
    } else {
      Serial.println("ActuatorManager full or invalid actuator!");
    }
  }

  void initializeActuators() {
    for (int i = 0; i < actuatorCount; i++) {
      actuators[i]->initialize();
    }
  }

  void registerActuators(const String deviceId) {
    StaticJsonDocument<1024> doc;
    doc["moduleKey"] = deviceId;
    JsonObject topics = doc.createNestedObject("topics");
    for (int i = 0; i < actuatorCount; i++) {
      actuators[i]->appendTopicsTo(topics);
    }

    char buffer[1024];
    size_t len = serializeJson(doc, buffer, sizeof(buffer));
    if (len == 0) {
      Serial.println("registerActuators: Serialization failed or buffer too small.");
    }
    Serial.println(buffer);

    sendToMQTT(ACTUATOR_REGISTER_TOPIC, buffer);
    Serial.println("Actuator Registered");
  }

  void updateAll() {
    for (int i = 0; i < actuatorCount; ++i) {
      if (actuators[i]) {
        actuators[i]->updateFast();
        if (actuators[i]->shouldUpdate()) {
          actuators[i]->update();
          actuators[i]->markUpdated();
        }
      }
    }
  }

  void onActionMessage(JsonDocument& doc) {
    // Check if the message is a command
    if (doc["messageType"].as<String>() == ACTION_MESSAGE_TYPE) {
      for (int i = 0; i < actuatorCount; ++i) {
        actuators[i]->onActionMessage(doc);
      }
    }
  }

  void subscribeAll(PubSubClient& client) {
    StaticJsonDocument<512> doc;
    JsonObject topics = doc.to<JsonObject>();

    for (int i = 0; i < actuatorCount; ++i) {
      actuators[i]->appendTopicsTo(topics);
    }

    for (JsonPair kv : topics) {
      const char* topic = kv.value();
      client.subscribe(topic);
      Serial.print("Subscribed to topic: ");
      Serial.println(topic);
    }
  }
};

#endif
