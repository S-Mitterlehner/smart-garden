#ifndef STEPPER_MOTOR_H
#define STEPPER_MOTOR_H

#include <Stepper.h>
#include <ArduinoJson.h>
#include "ActuatorManager.h"
#include "utils.h"

#define STEPS_PER_REV 2038  // Define the number of steps per revolution for the motor

class StepperMotor : public IActuator {
private:
  const String id;
  const String stepperMotorTopic;

  Stepper stepper;
  int rotatingSpeed = 10;
  int motorState = 0;  // 0-100%

  unsigned int currentPosition = 0;
  unsigned int targetPosition = 0;

  unsigned long lastStepTime = 0;
  const unsigned long stepDelay = 0;  // ms between steps

  const unsigned long interval = 10000;
  unsigned long lastMotorStatusTime = 0;

public:
  StepperMotor(int pin1, int pin2, int pin3, int pin4, String deviceId)
    : id(deviceId),
      stepper(STEPS_PER_REV, pin1, pin2, pin3, pin4),
      stepperMotorTopic("smart-garden/" + deviceId + "/stepper-motor") {

    Serial.print("Stepper Motor Topic: ");
    Serial.println(stepperMotorTopic);
  }

  void initialize() override {
    stepper.setSpeed(rotatingSpeed);
  }

  void update() override {
    unsigned long now = millis();

    // non blocking step of the motor
    if (currentPosition != targetPosition && now - lastStepTime >= stepDelay) {
      int direction = (targetPosition > currentPosition) ? 1 : -1;
      stepper.step(direction);
      currentPosition += direction;
      motorState = map(currentPosition, 0, STEPS_PER_REV, 0, 100);
      lastStepTime = now;
    }

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
    } else if (actionKey == "motor.set" && actionType == "Value") {
      float percent = value.toFloat();
      if (percent >= 0.0f && percent <= 100.0f) {
        targetPosition = map(percent, 0.0, 100.0, 0, STEPS_PER_REV);
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