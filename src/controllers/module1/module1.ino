#include <dht11.h> // TODO: Import dht11.zip (source: https://github.com/adidax/dht11#)
#include <WiFiS3.h>
#include <PubSubClient.h> // TODO: install PubSubClient
#include <ArduinoJson.h> // TODO: install ArduinoJson

#include "utils.h"

// Pins
const int DHT_PIN = 11;
const int motorBI = 9;
const int motorFI = 10;

dht11 DHT11;

String sensorRegisterTopic = "smart-garden/register/sensor";
String actuatorRegisterTopic = "smart-garden/register/actuator";
String temperatureTopic = "smart-garden/temp/temperature";
String humidityTopic = "smart-garden/temp/humidity";
String pumpTopic = "smart-garden/temp/waterpump";

String actionMessageType = "Action";

String deviceId = "temp";

extern WiFiClient network;
extern PubSubClient mqttClient;
extern String macAddress;

unsigned long lastPublishTime = 0;

String pumpState = "Stopped";

void  setup()
{
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  
  pinMode(motorBI, OUTPUT);
  pinMode(motorFI, OUTPUT);

  Serial.println("start motor");

  // setMotor(true);
  // Keep the pump on for 5 seconds
  // delay(5000);

  // Serial.println("stop motor");
  // setMotor(false);

  Serial.println("motor should stop");

  connectWifi();
  String d = String(macAddress.c_str());
  d.replace(":", "");
  deviceId = "sm-" + d;
  temperatureTopic = "smart-garden/" + deviceId + "/temperature";
  humidityTopic = "smart-garden/" + deviceId + "/humidity";
  pumpTopic = "smart-garden/" + deviceId + "/waterpump";

  Serial.print("Device Id: ");
  Serial.println(deviceId);

  Serial.print("Temperature Topic: ");
  Serial.println(temperatureTopic);

  Serial.print("Humidity Topic: ");
  Serial.println(humidityTopic);

  connectMQTT(deviceId);
  registerSensor();
  registerActuator();

  mqttClient.setCallback(listen);
  mqttClient.subscribe(pumpTopic.c_str());
}

void loop()
{
  sendMotorStatus();

  Serial.println();

  int chk = DHT11.read(DHT_PIN);

  Serial.print("Humidity (%): ");
  Serial.println((float)DHT11.humidity, 2);

  Serial.print("Temperature  (C): ");
  Serial.println((float)DHT11.temperature, 2);

  StaticJsonDocument<200> temperatureMessage;
  temperatureMessage["sensorKey"] = deviceId;
  temperatureMessage["sensorType"] = "Temperature";
  temperatureMessage["min"] = 0;
  temperatureMessage["max"] = 50;
  temperatureMessage["unit"] = "°C";
  temperatureMessage["currentValue"] = (float)DHT11.temperature;  // Or you can read data from other sensors
  char temperatureMessageBuffer[512];
  serializeJson(temperatureMessage, temperatureMessageBuffer);

  mqttClient.loop();
  sendToMQTT(temperatureTopic, temperatureMessageBuffer);

  delayWithLoop(5000);
  sendMotorStatus();

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

  delayWithLoop(5000);
}

void listen(char* topic, byte* payload, unsigned int length) {
  // parse the following message:
  // { "messageType": "", "actuatorKey": "sm-me", "actuatorType": "Pump", "actionType": "Command", "value": 12.34 }
  Serial.println("MESSAGE RECEIVED");
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  if ( doc["messageType"].as<String>() == actionMessageType 
    && doc["actuatorKey"].as<String>() == deviceId
    && doc["actuatorType"].as<String>() == "Pump"
    && doc["actionType"].as<String>() == "Command") {
    
    String actionKey = doc["actionKey"].as<String>();

    if (actionKey == "pump.start") {
      Serial.println("Pump ON");
      setMotor(true);
    } else if (actionKey == "pump.stop") {
      Serial.println("Pump OFF");
      setMotor(false);
    }
  }
}

void registerSensor() {
  JsonDocument doc;
  doc["sensorKey"] = deviceId;
  doc["topics"]["temperature"] = temperatureTopic;
  doc["topics"]["humidity"] = humidityTopic;
  char buffer[512];
  serializeJson(doc, buffer);

  Serial.println(buffer);

  sendToMQTT(sensorRegisterTopic, buffer);
  Serial.println("Sensor Registered");
}

void registerActuator() {
  JsonDocument doc;
  doc["actuatorKey"] = deviceId;
  doc["topics"]["pump"] = pumpTopic;
  char buffer[512];
  serializeJson(doc, buffer);

  Serial.println(buffer);

  sendToMQTT(actuatorRegisterTopic, buffer);
  Serial.println("Actuator Registered");
}

void setMotor(bool on) {
  if(on) {
    digitalWrite(motorBI, HIGH);
    digitalWrite(motorFI, LOW);
    pumpState = "Running";
  } else {
    digitalWrite(motorBI, LOW);
    digitalWrite(motorFI, LOW);
    pumpState = "Stopped";
  }

  sendMotorStatus();
}

void sendMotorStatus() {
  JsonDocument doc;
  doc["messageType"] = "State";
  doc["actuatorKey"] = deviceId;
  doc["actuatorType"] = "Pump";
  doc["stateType"] = "Discrete";
  doc["state"] = pumpState;
  char buffer[512];
  serializeJson(doc, buffer);
  sendToMQTTRetained(pumpTopic, buffer);
  Serial.print("Motor Status: ");
  Serial.println(buffer);
}

void delayWithLoop(int ms) {
  int parts = ms / 1000;

  for (int i = 0; i < parts; i++) {
    delay(1000);
    mqttClient.loop();
  }
}
