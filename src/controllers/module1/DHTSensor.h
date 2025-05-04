#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include <DHT.h>  // TODO: install "DHT sensor library"
#include <ArduinoJson.h>
#include "SensorManager.h"
#include "utils.h"

class DHTSensor : public ISensor {
private:
  const String id;
  const String tempTopic;
  const String humidityTopic;
  
  DHT dht;
  unsigned long lastSent = 0;
  const unsigned long interval = 5000;

public:
  DHTSensor(int pin, String deviceId)
    : dht(pin, DHT11),
      id(deviceId),
      tempTopic("smart-garden/" + deviceId + "/temperature"),
      humidityTopic("smart-garden/" + deviceId + "/humidity") {

    Serial.print("Temperature Topic: ");
    Serial.println(tempTopic);
    Serial.print("Humidity Topic: ");
    Serial.println(humidityTopic);
  }

  void initialize() override {
    dht.begin();
  }

  void update() override {
    if (millis() - lastSent < interval) return;

    measureTemperature();
    measureHumidity();

    lastSent = millis();
  }

  void appendTopicsTo(JsonObject& parent) override {
    parent["temperature"] = tempTopic;
    parent["humidity"] = humidityTopic;
  }

private:
  void measureTemperature() {
    float temp = dht.readTemperature();
    Serial.print("Temperature  (C): ");
    Serial.println(temp, 2);
    publishSensorReading(tempTopic, "Temperature", temp, 0, 50, "°C");
  }

  void measureHumidity() {
    float humidity = dht.readHumidity();
    Serial.print("Humidity (%): ");
    Serial.println(humidity, 2);
    publishSensorReading(humidityTopic, "Humidity", humidity, 20, 90, "%");
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