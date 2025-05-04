#include <WiFiS3.h>
#include <PubSubClient.h>  // TODO: install "PubSubClient"
#include <ArduinoJson.h>   // TODO: install "ArduinoJson"

#include "utils.h"
#include "SensorManager.h"
#include "ActuatorManager.h"
#include "DHTSensor.h"
#include "Pump.h"
#include "StepperMotor.h"

// Constants
const int PIN_MOTOR_IN1 = 2;
const int PIN_MOTOR_IN2 = 3;
const int PIN_MOTOR_IN3 = 4;
const int PIN_MOTOR_IN4 = 5;
const int PIN_pumpBI = 9;
const int PIN_pumpFI = 10;
const int PIN_DHT = 11;

// References
extern WiFiClient network;
extern PubSubClient mqttClient;
extern String macAddress;

static String deviceId;
static SensorManager sensorManager;
static ActuatorManager actuatorManager;


void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ;  // wait for serial port to connect. Needed for native USB port only
  }

  Serial.println("Connecting to WIFI ...");
  connectWifi();
  deviceId = getDeviceId();

  setupSensors();
  setupActuators();

  Serial.println("Connecting to MQTT ...");
  connectMQTT(deviceId);

  // Register sensors and actors at MQTT
  Serial.println("Registering Sensors ...");
  sensorManager.registerSensors(deviceId);
  Serial.println("Registering Actuators ...");
  actuatorManager.registerActuators(deviceId);


  mqttClient.setCallback(listen);
  actuatorManager.subscribeAll(mqttClient);
}

void loop() {
  mqttClient.loop();
  sensorManager.updateAll();
  actuatorManager.updateAll();
}

void setupSensors() {
  sensorManager.addSensor(new DHTSensor(PIN_DHT, deviceId));
  // sensorManager.addSensor(new ...);
  sensorManager.initializeSensors();
}

void setupActuators() {
  actuatorManager.addActuator(new Pump(PIN_pumpBI, PIN_pumpFI, deviceId));
  actuatorManager.addActuator(new StepperMotor(PIN_MOTOR_IN1, PIN_MOTOR_IN2, PIN_MOTOR_IN3, PIN_MOTOR_IN4, deviceId));
  // actuatorManager.addActuator(new ...);
  actuatorManager.initializeActuators();
}

String getDeviceId() {
  String d = String(macAddress.c_str());
  d.replace(":", "");
  return "sm-" + d;
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

  // Check if the message is for this device
  if (doc["actuatorKey"].as<String>() == deviceId) {
    actuatorManager.onActionMessage(doc);
  }
}
