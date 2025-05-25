#ifndef PUMP_H
#define PUMP_H

#include <ArduinoJson.h>
#include "ActuatorManager.h"
#include "utils.h"

class Pump : public Actuator {
private:
  const String id;
  const int pinBI;
  const int pinFI;
  const String pumpTopic;

  String pumpState = "Stopped";
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

  unsigned long getInterval() const override {
    return 5000;
  }

  void initialize() override {
    pinMode(pinBI, OUTPUT);
    pinMode(pinFI, OUTPUT);
  }

  void update() override {
    sendPumpStatus();
  }

  void updateFast() override {
    unsigned long now = millis();
    if (pumpRunningForDuration && now >= pumpStopTime) {
      setPump(false);
      pumpRunningForDuration = false;
    }
  }

  void appendTopicsTo(JsonObject& parent) override {
    parent["pump"] = pumpTopic;
  }

  void onActionMessage(JsonDocument& doc) override {
    Serial.println("Pump Action called");
    String moduleType = doc["moduleType"] | "";
    if (moduleType != "Pump") return;

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
    doc["moduleKey"] = id;
    doc["moduleType"] = "Pump";
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