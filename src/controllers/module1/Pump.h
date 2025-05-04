#ifndef PUMP_H
#define PUMP_H

#include <ArduinoJson.h>
#include "ActuatorManager.h"
#include "utils.h"

class Pump : public IActuator {
private:
  const String id;
  const int pinBI;
  const int pinFI;
  const String pumpTopic;

  unsigned long lastSent = 0;
  const unsigned long interval = 10000;

  String pumpState = "Stopped";
  unsigned long lastPumpStatusTime = 0;
  unsigned long pumpStopTime = 0;
  bool pumpRunningForDuration = false;


public:
  Pump(int pinBI, int pinFI, String deviceId)
    : pinBI(pinBI),
      pinFI(pinFI),
      id(deviceId),
      pumpTopic("smart-garden/" + deviceId + "/waterpump") {

    Serial.print("Pump Topic: ");
    Serial.println(pumpTopic);
  }

  void initialize() override {
    pinMode(pinBI, OUTPUT);
    pinMode(pinFI, OUTPUT);
  }

  void update() override {
    unsigned long now = millis();
    if ((now - lastSent < interval) && !pumpRunningForDuration) return;

    if (now - lastPumpStatusTime >= interval) {
      lastPumpStatusTime = now;
      sendPumpStatus();
    }

    if (pumpRunningForDuration && now >= pumpStopTime) {
      setPump(false);
      pumpRunningForDuration = false;
    }

    lastSent = now;
  }

  void appendTopicsTo(JsonObject& parent) override {
    parent["pump"] = pumpTopic;
  }

  // void onActionMessage(JsonDocument& doc) override {
  //   if (doc["actuatorType"].as<String>() == "Pump") {
  //     String actionKey = doc["actionKey"].as<String>();

  //     if (actionKey == "pump.start" && doc["actionType"].as<String>() == "Command") {
  //       setPump(true);
  //     } else if (actionKey == "pump.stop" && doc["actionType"].as<String>() == "Command") {
  //       setPump(false);
  //       pumpRunningForDuration = false;
  //     } else if (actionKey == "pump.run" && doc["value"].as<float>() > 0 && doc["actionType"].as<String>() == "Value") {
  //       float value = doc["value"].as<float>();

  //       pumpStopTime = millis() + (value * 1000);
  //       pumpRunningForDuration = true;
  //       setPump(true);
  //     } else {
  //       Serial.println("Unknown action key");
  //     }
  //   }
  // }

  void onActionMessage(JsonDocument& doc) override {
    String actuatorType = doc["actuatorType"] | "";
    if (actuatorType != "Pump") return;

    String actionKey = doc["actionKey"] | "";
    String actionType = doc["actionType"] | "";

    if (actionKey == "pump.start" && actionType == "Command") {
      setPump(true);
    } else if (actionKey == "pump.stop" && actionType == "Command") {
      setPump(false);
      pumpRunningForDuration = false;
    } else if (actionKey == "pump.run" && actionType == "Value") {
      float value = doc["value"].as<float>();
      if (value > 0.0f) {
        pumpStopTime = millis() + static_cast<unsigned long>(value * 1000);
        pumpRunningForDuration = true;
        setPump(true);
      }
    } else {
      Serial.println("Unknown action key or type");
    }
  }


private:

  void setPump(bool on) {
    if (on) {
      digitalWrite(pinBI, HIGH);
      digitalWrite(pinFI, LOW);
      pumpState = "Running";
    } else {
      digitalWrite(pinBI, LOW);
      digitalWrite(pinFI, LOW);
      pumpState = "Stopped";
    }

    sendPumpStatus();
  }

  void sendPumpStatus() {
    JsonDocument doc;
    doc["messageType"] = "State";
    doc["actuatorKey"] = id;
    doc["actuatorType"] = "Pump";
    doc["stateType"] = "Discrete";
    doc["state"] = pumpState;

    char buffer[512];
    serializeJson(doc, buffer);

    sendToMQTTRetained(pumpTopic, buffer);

    Serial.print("Pump Status: ");
    Serial.println(buffer);
  }
};

#endif