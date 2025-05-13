import { gql } from "@apollo/client";

export const SENSOR_QUERY = gql`
  query getSensors {
    sensors {
      id
      name
      description
      key
      type
    }
  }
`;

export const SENSOR_BY_ID_QUERY = gql`
  query getSensorById($id: UUID!) {
    sensor(id: $id) {
      id
      key
      name
      type
      description
      currentValue
      maxValue
      minValue
      unit
    }
  }
`;
