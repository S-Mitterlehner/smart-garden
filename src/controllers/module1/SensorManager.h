#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <ArduinoJson.h>
#include "utils.h"
#include "Component.h"

#define MAX_SENSORS 10
#define SENSOR_REGISTER_TOPIC "smart-garden/register/sensor"

class SensorManager {
private:
  Sensor* sensors[MAX_SENSORS];
  int sensorCount = 0;

public:
  void addSensor(Sensor* sensor) {
    if (sensor && sensorCount < MAX_SENSORS) {
      sensors[sensorCount++] = sensor;
    } else {
      Serial.println("SensorManager full or invalid sensor!");
    }
  }

  void initializeSensors() {
    for (int i = 0; i < sensorCount; i++) {
      sensors[i]->initialize();
    }
  }

  void registerSensors(const String deviceId) {
    StaticJsonDocument<1024> doc;
    doc["sensorKey"] = deviceId;
    JsonObject topics = doc.createNestedObject("topics");
    for (int i = 0; i < sensorCount; i++) {
      sensors[i]->appendTopicsTo(topics);
    }

    char buffer[1024];
    size_t len = serializeJson(doc, buffer, sizeof(buffer));
    if (len == 0) {
      Serial.println("registerSensors: Serialization failed or buffer too small.");
    }
    Serial.println(buffer);

    sendToMQTT(SENSOR_REGISTER_TOPIC, buffer);
    Serial.println("Sensor Registered");
  }

  void updateAll() {
    for (int i = 0; i < sensorCount; ++i) {
      if (sensors[i] && sensors[i]->shouldUpdate()) {
        sensors[i]->update();
        sensors[i]->markUpdated();
      }
    }
  }
};

#endif