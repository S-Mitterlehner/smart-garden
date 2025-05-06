#ifndef STEPPER_MOTOR_H
#define STEPPER_MOTOR_H

#include <AccelStepper.h>  // TODO install AccelStepper
#include <ArduinoJson.h>
#include "ActuatorManager.h"
#include "utils.h"

#define STEPS_PER_REV 2038  // Define the number of steps per revolution for the motor

class StepperMotor : public IActuator {
private:
  const String id;
  const String stepperMotorTopic;

  AccelStepper stepper;
  int hatchState = 0;  // 0-100%

  unsigned int targetPosition = 0;

  unsigned long lastHatchStatusTime = 0;
  const unsigned long interval = 5000;

public:
  StepperMotor(int pin1, int pin2, int pin3, int pin4, String deviceId)
    : id(deviceId),
      stepper(AccelStepper::FULL4WIRE, pin1, pin2, pin3, pin4),
      stepperMotorTopic("smart-garden/" + deviceId + "/hatch") {

    Serial.print("Hatch Topic: ");
    Serial.println(stepperMotorTopic);
  }

  void initialize() override {
    stepper.setMaxSpeed(1000);      // Steps per second
    stepper.setAcceleration(1000);  // Maximum acceleration
  }

  void update() override {
    stepper.run();
    int position = stepper.currentPosition();
    hatchState = map(position, 0, STEPS_PER_REV, 0, 100);

    unsigned long now = millis();
    if (now - lastHatchStatusTime >= interval) {
      lastHatchStatusTime = now;
      sendMotorStatus();
    }
  }

  void appendTopicsTo(JsonObject& parent) override {
    parent["hatch"] = stepperMotorTopic;
  }

  void onActionMessage(JsonDocument& doc) override {
    String actuatorType = doc["actuatorType"] | "";
    if (actuatorType != "Hatch") return;

    String actionKey = doc["actionKey"] | "";
    String actionType = doc["actionType"] | "";
    float value = doc["value"] | -1.0;  // value in %

    if ((actionKey == "hatch.open" || actionKey == "hatch.close") && actionType == "Command") {
      targetPosition = (actionKey == "hatch.open") ? STEPS_PER_REV : 0;
      stepper.moveTo(targetPosition);
    } else if (actionKey == "hatch.set" && actionType == "Value") {
      if (value >= 0.0f && value <= 100.0f) {
        targetPosition = map(value, 0.0, 100.0, 0, STEPS_PER_REV);
        stepper.moveTo(targetPosition);
      } else {
        Serial.println("Invalid value for hatch.set (expect 0-100)");
      }
    } else {
      Serial.println("Unknown action key for Hatch");
    }
  }


private:

  void sendMotorStatus() {
    JsonDocument doc;
    doc["messageType"] = "State";
    doc["actuatorKey"] = id;
    doc["actuatorType"] = "Hatch";
    doc["stateType"] = "Continuous";
    doc["min"] = 0;
    doc["max"] = 100;
    doc["currentValue"] = hatchState;

    char buffer[512];
    serializeJson(doc, buffer);
    sendToMQTTRetained(stepperMotorTopic, buffer);

    Serial.print("Hatch Status: ");
    Serial.println(buffer);
  }
};


#endif