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
  int motorState = 0;  // 0-100%

  unsigned int targetPosition = 0;

  unsigned long lastMotorStatusTime = 0;
  const unsigned long interval = 10000;

public:
  StepperMotor(int pin1, int pin2, int pin3, int pin4, String deviceId)
    : id(deviceId),
      stepper(AccelStepper::FULL4WIRE, pin1, pin2, pin3, pin4),
      stepperMotorTopic("smart-garden/" + deviceId + "/stepper-motor") {

    Serial.print("Stepper Motor Topic: ");
    Serial.println(stepperMotorTopic);
  }

  void initialize() override {
    stepper.setMaxSpeed(1000);      // Steps per second
    stepper.setAcceleration(1000);  // Maximum acceleration
  }

  void update() override {
    stepper.run();
    int position = stepper.currentPosition();
    motorState = map(position, 0, STEPS_PER_REV, 0, 100);

    unsigned long now = millis();
    if (now - lastMotorStatusTime >= interval) {
      lastMotorStatusTime = now;
      sendMotorStatus();
    }
  }

  void appendTopicsTo(JsonObject& parent) override {
    parent["stepperMotor"] = stepperMotorTopic;
  }

  void onActionMessage(JsonDocument& doc) override {
    String actuatorType = doc["actuatorType"] | "";
    if (actuatorType != "StepperMotor") return;

    String actionKey = doc["actionKey"] | "";
    String actionType = doc["actionType"] | "";
    String value = doc["value"] | "-1.0";

    if ((actionKey == "motor.open" || actionKey == "motor.close") && actionType == "Command") {
      targetPosition = (actionKey == "motor.open") ? STEPS_PER_REV : 0;
      stepper.moveTo(targetPosition);
    } else if (actionKey == "motor.set" && actionType == "Value") {
      float percent = value.toFloat();
      if (percent >= 0.0f && percent <= 100.0f) {
        targetPosition = map(percent, 0.0, 100.0, 0, STEPS_PER_REV);
        stepper.moveTo(targetPosition);
      } else {
        Serial.println("Invalid value for motor.set (expect 0-100)");
      }
    } else {
      Serial.println("Unknown action key for StepperMotor");
    }
  }


private:

  void sendMotorStatus() {
    JsonDocument doc;
    doc["messageType"] = "State";
    doc["actuatorKey"] = id;
    doc["actuatorType"] = "StepperMotor";
    doc["stateType"] = "Discrete";
    doc["state"] = motorState;

    char buffer[512];
    serializeJson(doc, buffer);
    sendToMQTTRetained(stepperMotorTopic, buffer);

    Serial.print("Stepper Motor Status: ");
    Serial.println(buffer);
  }
};


#endif