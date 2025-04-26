#include <DHT.h> // TODO: install "DHT sensor library"
#include <WiFiS3.h>
#include <PubSubClient.h> // TODO: install "PubSubClient"
#include <ArduinoJson.h> // TODO: install "ArduinoJson"

#include "utils.h"

// Constants
#define DHTTYPE DHT11
const int DHT_PIN = 11;
const int pumpBI = 9;
const int pumpFI = 10;

const String actionMessageType = "Action";


// Invervals
const unsigned long temperatureInterval = 5000;
const unsigned long humidityInterval = 5000;
const unsigned long pumpInterval = 10000;

// Device Variables
String deviceId = "temp";
String sensorRegisterTopic = "smart-garden/register/sensor";
String actuatorRegisterTopic = "smart-garden/register/actuator";
String temperatureTopic = "smart-garden/temp/temperature";
String humidityTopic = "smart-garden/temp/humidity";
String pumpTopic = "smart-garden/temp/waterpump";


// References
extern WiFiClient network;
extern PubSubClient mqttClient;
extern String macAddress;
DHT dht(DHT_PIN, DHTTYPE);


// State
String pumpState = "Stopped";

// Timing Variables
unsigned long lastTemperatureTime = 0;
unsigned long lastHumidityTime = 0;
unsigned long lastPumpStatusTime = 0;
unsigned long pumpStopTime = 0;
bool pumpRunningForDuration = false;


void  setup()
{
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  
  // Temperature & Humidity Sensor
  dht.begin();

  // Pump
  pinMode(pumpBI, OUTPUT);
  pinMode(pumpFI, OUTPUT);

  connectWifi();
  setupDeviceStrings();

  Serial.println("Connecting to MQTT...");
  connectMQTT(deviceId);

  Serial.println("Connected to MQTT");
  Serial.println("Registering Sensor and Actuator...");

  registerSensor();
  registerActuator();

  mqttClient.setCallback(listen);
  mqttClient.subscribe(pumpTopic.c_str());
}

void loop()
{
  unsigned long now = millis();

  mqttClient.loop();

  if (now - lastTemperatureTime >= temperatureInterval) {
    lastTemperatureTime = now;
    measureTemperature();
  }

  if (now - lastHumidityTime >= humidityInterval) {
    lastHumidityTime = now;
    measureHumidity();
  }

  if (now - lastPumpStatusTime >= pumpInterval) {
    lastPumpStatusTime = now;
    sendPumpStatus();
  }

  if (pumpRunningForDuration && now >= pumpStopTime) {
    setPump(false);
    pumpRunningForDuration = false;
  }
}

void setupDeviceStrings() {
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

  Serial.print("Pump Topic: ");
  Serial.println(pumpTopic);
}

void measureTemperature() {
  float temperature = dht.readTemperature();
  Serial.print("Temperature  (C): ");
  Serial.println(temperature, 2);

  StaticJsonDocument<200> temperatureMessage;
  temperatureMessage["sensorKey"] = deviceId;
  temperatureMessage["sensorType"] = "Temperature";
  temperatureMessage["min"] = 0;
  temperatureMessage["max"] = 50;
  temperatureMessage["unit"] = "°C";
  temperatureMessage["currentValue"] = temperature;
  char temperatureMessageBuffer[512];
  serializeJson(temperatureMessage, temperatureMessageBuffer);

  sendToMQTT(temperatureTopic, temperatureMessageBuffer);
}

void measureHumidity() {
  float humidity = dht.readHumidity();
  Serial.print("Humidity (%): ");
  Serial.println(humidity, 2);

  StaticJsonDocument<200> humidityMessage;
  humidityMessage["sensorKey"] = deviceId;
  humidityMessage["sensorType"] = "Humidity";
  humidityMessage["min"] = 20;
  humidityMessage["max"] = 90;
  humidityMessage["unit"] = "%";
  humidityMessage["currentValue"] = humidity;
  char humidityMessageBuffer[512];
  serializeJson(humidityMessage, humidityMessageBuffer);
  
  sendToMQTT(humidityTopic, humidityMessageBuffer);
}

void listen(char* topic, byte* payload, unsigned int length) {
  // messageForm: { "messageType": "", "actuatorKey": "sm-me", "actuatorType": "Pump", "actionType": "Command", "value": 12.34 }
  Serial.println("MESSAGE RECEIVED");
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  // Check if the message is for this device and a command
  if ( doc["messageType"].as<String>() == actionMessageType 
    && doc["actuatorKey"].as<String>() == deviceId
    && doc["actuatorType"].as<String>() == "Pump") {
    
    String actionKey = doc["actionKey"].as<String>();

    if (actionKey == "pump.start" && doc["actionType"].as<String>() == "Command") {
      setPump(true);
    } else if (actionKey == "pump.stop" && doc["actionType"].as<String>() == "Command") {
      setPump(false);
      pumpRunningForDuration = false;
    } else if (actionKey == "pump.run" && doc["value"].as<float>() > 0 && doc["actionType"].as<String>() == "Value") {
      float value = doc["value"].as<float>();

      pumpStopTime = millis() + (value * 1000);
      pumpRunningForDuration = true;
      setPump(true);
    } else {
      Serial.println("Unknown action key");
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

void setPump(bool on) {
  if(on) {
    digitalWrite(pumpBI, HIGH);
    digitalWrite(pumpFI, LOW);
    pumpState = "Running";
  } else {
    digitalWrite(pumpBI, LOW);
    digitalWrite(pumpFI, LOW);
    pumpState = "Stopped";
  }

  sendPumpStatus();
}

void sendPumpStatus() {
  JsonDocument doc;
  doc["messageType"] = "State";
  doc["actuatorKey"] = deviceId;
  doc["actuatorType"] = "Pump";
  doc["stateType"] = "Discrete";
  doc["state"] = pumpState;

  char buffer[512];
  serializeJson(doc, buffer);

  sendToMQTTRetained(pumpTopic, buffer);

  Serial.print("Pump Status: ");
  Serial.println(buffer);
}
