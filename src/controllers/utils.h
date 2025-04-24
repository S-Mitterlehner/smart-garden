#include <WiFiS3.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#include "arduino_secrets.h" 

char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)
int status = WL_IDLE_STATUS;     // the WiFi radio's status

String macAddress;

// char mqttServerAddress[] = "broker.mqttdashboard.com";
char mqttServerAddress[] = "test.mosquitto.org";
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
    while (true);
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
  Serial.print("You're connected to the network");
  
  byte mac[6];
  WiFi.macAddress(mac);
  macAddress = getMacAddressAsString(mac);
  Serial.print("MAC address: ");
  Serial.println(macAddress);
  

  printCurrentNet();
  printWifiData();
}

void connectMQTT(String deviceId) {
  if(mqttClient.connected()) {
    mqttClient.disconnect();
  }

  mqttClient.setServer(mqttServerAddress, mqttServerPort);
  while (!mqttClient.connected()) {
    if (mqttClient.connect(deviceId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 1 seconds");
      delay(1000);
    }
  }
}

void sendToMQTT(const String topic, const String json) {
  if(mqttClient.connected()) {
    mqttClient.publish(topic.c_str(), json.c_str(), false);
  }
}