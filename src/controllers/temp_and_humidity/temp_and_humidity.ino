#include <dht11.h> // TODO: Import dht11.zip (source: https://github.com/adidax/dht11#)
#include <WiFiS3.h>
#include <PubSubClient.h> // TODO: install PubSubClient
#include <ArduinoJson.h> // TODO: install ArduinoJson

#include "utils.h"

const int DHT_PIN = 11;

dht11 DHT11;

String registerTopic = "smart-garden/register/sensor";
String temperatureTopic = "smart-garden/temp-1234/temperature";
String humidityTopic = "smart-garden/temp-1234/humidity";

String deviceId = "temp-1234";

extern WiFiClient network;
extern PubSubClient mqttClient;
extern String macAddress;

unsigned long lastPublishTime = 0;

void  setup()
{
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  connectWifi();
  String d = String(macAddress.c_str());
  d.replace(":", "");
  deviceId = "sm-" + d;
  temperatureTopic = "smart-garden/" + deviceId + "/temperature";
  humidityTopic = "smart-garden/" + deviceId + "/humidity";

  Serial.print("Device Id: ");
  Serial.println(deviceId);

  Serial.print("Temperature Topic: ");
  Serial.println(temperatureTopic);

  Serial.print("Humidity Topic: ");
  Serial.println(humidityTopic);

  connectMQTT(deviceId);
  registerSensor();
}

void loop()
{
  Serial.println();

  int chk = DHT11.read(DHT_PIN);

  Serial.print("Humidity (%): ");
  Serial.println((float)DHT11.humidity, 2);

  Serial.print("Temperature  (C): ");
  Serial.println((float)DHT11.temperature, 2);

  StaticJsonDocument<200> message;
  message["sensorKey"] = deviceId;
  message["sensorType"] = "Temperature";
  message["min"] = 0;
  message["max"] = 50;
  message["unit"] = "°C";
  message["currentValue"] = (float)DHT11.temperature;  // Or you can read data from other sensors
  char messageBuffer[512];
  serializeJson(message, messageBuffer);

  sendToMQTT(temperatureTopic, messageBuffer);

  delay(5000);

  chk = DHT11.read(DHT_PIN);

  StaticJsonDocument<200> humidityMessage;
  humidityMessage["sensorKey"] = deviceId;
  humidityMessage["sensorType"] = "Humidity";
  humidityMessage["min"] = 20;
  humidityMessage["max"] = 90;
  humidityMessage["unit"] = "%";
  humidityMessage["currentValue"] = (float)DHT11.humidity;  // Or you can read data from other sensors
  char humidityMessageBuffer[512];
  serializeJson(humidityMessage, humidityMessageBuffer);

  sendToMQTT(humidityTopic, humidityMessageBuffer);

  delay(5000);
}

void registerSensor() {
  JsonDocument doc;
  doc["sensorKey"] = deviceId;
  doc["topics"]["temperature"] = temperatureTopic;
  doc["topics"]["humidity"] = humidityTopic;
  char buffer[512];
  serializeJson(doc, buffer);

  Serial.println(buffer);

  sendToMQTT(registerTopic, buffer);
  Serial.println("Sensor Registered");
}
