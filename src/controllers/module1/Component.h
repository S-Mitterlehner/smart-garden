#ifndef COMPONENT_H
#define COMPONENT_H

#include <ArduinoJson.h>

class Component {
protected:
  unsigned long lastSent = 0;

public:
  virtual void initialize() = 0;
  virtual void update() = 0;
  virtual void appendTopicsTo(JsonObject &parent) = 0;
  virtual unsigned long getInterval() const = 0;

  bool shouldUpdate() {
    return millis() - lastSent >= getInterval();
  }

  void markUpdated() {
    lastSent = millis();
  }
};

class Actuator : public Component {
public:
  virtual void updateFast() = 0;
  virtual void onActionMessage(JsonDocument &doc) = 0;
  virtual ~Actuator() = default;
};

class Sensor : public Component {
public:
  virtual ~Sensor() = default;
};

#endif