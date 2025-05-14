#ifndef UTILS_H
#define UTILS_H

#include <WiFiS3.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include "arduino_secrets.h"

char ssid[] = SECRET_SSID;    // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;  // the WiFi radio's status

String macAddress;

// char mqttServerAddress[] = "broker.mqttdashboard.com";
// char mqttServerAddress[] = "test.mosquitto.org";
char mqttServerAddress[] = "broker.emqx.io";
int mqttServerPort = 1883;

WiFiClient network;
PubSubClient mqttClient(network);


String getMacAddressAsString(byte mac[]) {
  String macAddress = "";
  for (int i = 0; i < 6; i++) {
    if (i > 0) {
      macAddress += ":";
    }
    if (mac[i] < 16) {
      macAddress += "0";
    }
    macAddress += String(mac[i], HEX);
  }
  return macAddress;
}

void printCurrentNet() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the MAC address of the router you're attached to:
  byte bssid[6];
  WiFi.BSSID(bssid);
  Serial.print("BSSID: ");

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.println(rssi);

  // print the encryption type:
  byte encryption = WiFi.encryptionType();
  Serial.print("Encryption Type:");
  Serial.println(encryption, HEX);
  Serial.println();
}

void printWifiData() {
  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");

  Serial.println(ip);
}

void connectWifi() {
  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true)
      ;
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }

  // you're connected now, so print out the data:
  Serial.println("You're connected to the network");

  byte mac[6];
  WiFi.macAddress(mac);
  macAddress = getMacAddressAsString(mac);
  Serial.print("MAC address: ");
  Serial.println(macAddress);


  printCurrentNet();
  printWifiData();
}

void connectMQTT(String deviceId) {
  if (mqttClient.connected()) {
    mqttClient.disconnect();
  }

  mqttClient.setServer(mqttServerAddress, mqttServerPort);
  while (!mqttClient.connected()) {
    if (mqttClient.connect(deviceId.c_str())) {
      Serial.println("Success, MQTT device with ID " + deviceId + " connected!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 1 seconds");
      delay(1000);
    }
  }
}

void delayWithLoop(int ms) {
  int parts = ms / 1000;

  for (int i = 0; i < parts; i++) {
    delay(1000);
    mqttClient.loop();
  }
}

void sendToMQTT(const String topic, const String json) {
  if (mqttClient.connected()) {
    mqttClient.loop();
    mqttClient.publish(topic.c_str(), json.c_str(), false);
  }
}

void sendToMQTTRetained(const String topic, const String json) {
  if (mqttClient.connected()) {
    mqttClient.loop();
    mqttClient.publish(topic.c_str(), json.c_str(), true);
  }
}

void publishSensorReading(const String& id, const String& topic, const String& type,
  float value, float min, float max, const String& unit) {

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

#endif