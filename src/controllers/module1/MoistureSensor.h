#ifndef MOISTURE_SENSOR_H
#define MOISTURE_SENSOR_H

#include <ArduinoJson.h>
#include "SensorManager.h"
#include "utils.h"

class MoistureSensor : public ISensor {
private:
  const String id;
  const String moistureTopic;
  const int analogPin;
  
  unsigned long lastSent = 0;
  const unsigned long interval = 5000;

public:
  MoistureSensor(int pin, String deviceId)
    : id(deviceId),
      analogPin(pin),
      moistureTopic("smart-garden/" + deviceId + "/moisture") {

    Serial.print("Moisture Topic: ");
    Serial.println(moistureTopic);
  }

  void initialize() override { }

  void update() override {
    if (millis() - lastSent < interval) return;

    measureMoisture();

    lastSent = millis();
  }

  void appendTopicsTo(JsonObject& parent) override {
    parent["moisture"] = moistureTopic;
  }

private:
  void measureMoisture() {
    int min = 225;  // wet
    int max = 550;  // dry
    int moistVal = analogRead(analogPin);
    moistVal = constrain(moistVal, min, max);
    int percent = 100 * (max - moistVal) / (max - min);  // maps moistVal to 0-100%
    Serial.print("Moisture (%): ");
    Serial.println(percent);
    publishSensorReading(moistureTopic, "Moisture", percent, 0, 100, "%");
  }

  void publishSensorReading(const String& topic, const String& type, float value, float min, float max, const String& unit) {
    if (isnan(value)) {
      Serial.print("Invalid reading for ");
      Serial.println(type);
      return;
    }

    StaticJsonDocument<200> message;
    message["sensorKey"] = id;
    message["sensorType"] = type;
    message["min"] = min;
    message["max"] = max;
    message["unit"] = unit;
    message["currentValue"] = value;

    char buffer[512];
    serializeJson(message, buffer);
    sendToMQTT(topic, buffer);
  }
};


#endif