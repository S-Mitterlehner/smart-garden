#include <dht11.h> // https://github.com/adidax/dht11#
#include <WiFiS3.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include "utils.h"

const int DHT_PIN = 11;

dht11 DHT11;

char temperatureTopic[] = "smart-garden/temp-1234/temperature";
char humidityTopic[] = "smart-garden/temp-1234/humidity";

char deviceId[] = "smart-garden/temp-1234";

extern WiFiClient network;
extern PubSubClient mqttClient;

unsigned long lastPublishTime = 0;

void  setup()
{
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  connectWifi();
  connectMQTT(deviceId);
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