#ifndef MOISTURE_SENSOR_H
#define MOISTURE_SENSOR_H

#include <ArduinoJson.h>
#include "SensorManager.h"
#include "utils.h"

class MoistureSensor : public Sensor {
private:
  const String id;
  const String moistureTopic;
  const int analogPin;

public:
  MoistureSensor(int pin, String deviceId)
    : id(deviceId),
      analogPin(pin),
      moistureTopic("smart-garden/" + deviceId + "/moisture") {

    Serial.print("Moisture Topic: ");
    Serial.println(moistureTopic);
  }

  unsigned long getInterval() const override {
    return 5000;
  }

  void initialize() override {}

  void update() override {
    measureMoisture();
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
    publishSensorReading(id, moistureTopic, "Moisture", percent, 0, 100, "%");
  }
};


#endif