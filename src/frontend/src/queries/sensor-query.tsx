import { gql } from "@apollo/client";

export const SENSOR_QUERY = gql`
  query {
    sensors {
      id
      name
      currentValue
      maxValue
      minValue
      unit
    }
  }
`;

export const SENSOR_BY_ID_QUERY = gql`
  query ($id: String!) {
    sensor(id: $id) {
      id
      name
      currentValue
      maxValue
      minValue
      unit
    }
  }
`;
