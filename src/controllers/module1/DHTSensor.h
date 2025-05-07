#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include <DHT.h>  // TODO: install "DHT sensor library"
#include <ArduinoJson.h>
#include "SensorManager.h"
#include "utils.h"

class DHTSensor : public Sensor {
private:
  const String id;
  const String tempTopic;
  const String humidityTopic;
  DHT dht;

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

  unsigned long getInterval() const override {
    return 5000;
  }

  void initialize() override {
    dht.begin();
  }

  void update() override {
    measureTemperature();
    measureHumidity();
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
    publishSensorReading(id, tempTopic, "Temperature", temp, 0, 50, "°C");
  }

  void measureHumidity() {
    float humidity = dht.readHumidity();
    Serial.print("Humidity (%): ");
    Serial.println(humidity, 2);
    publishSensorReading(id, humidityTopic, "Humidity", humidity, 20, 90, "%");
  }
};

#endif