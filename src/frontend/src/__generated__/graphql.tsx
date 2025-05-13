import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type ActuatorActionDto = {
  __typename?: 'ActuatorActionDto';
  currentValue?: Maybe<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  icon: Scalars['String']['output'];
  increment?: Maybe<Scalars['Float']['output']>;
  isAllowed: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  unit?: Maybe<Scalars['String']['output']>;
};

export type ActuatorActionDtoFilterInput = {
  and?: InputMaybe<Array<ActuatorActionDtoFilterInput>>;
  currentValue?: InputMaybe<FloatOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  icon?: InputMaybe<StringOperationFilterInput>;
  increment?: InputMaybe<FloatOperationFilterInput>;
  isAllowed?: InputMaybe<BooleanOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  max?: InputMaybe<FloatOperationFilterInput>;
  min?: InputMaybe<FloatOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ActuatorActionDtoFilterInput>>;
  type?: InputMaybe<StringOperationFilterInput>;
  unit?: InputMaybe<StringOperationFilterInput>;
};

export type ActuatorDto = {
  __typename?: 'ActuatorDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  state: ActuatorStateDto;
  type: Scalars['String']['output'];
};

export type ActuatorDtoFilterInput = {
  and?: InputMaybe<Array<ActuatorDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ActuatorDtoFilterInput>>;
  state?: InputMaybe<ActuatorStateDtoFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
};

export type ActuatorRef = {
  __typename?: 'ActuatorRef';
  connectorKey?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  topic?: Maybe<Scalars['String']['output']>;
  type: ActuatorType;
};

export type ActuatorRefDto = {
  __typename?: 'ActuatorRefDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type ActuatorRefDtoFilterInput = {
  and?: InputMaybe<Array<ActuatorRefDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ActuatorRefDtoFilterInput>>;
  type?: InputMaybe<StringOperationFilterInput>;
};

export type ActuatorStateDto = {
  __typename?: 'ActuatorStateDto';
  actions: Array<ActuatorActionDto>;
  actuatorKey: Scalars['String']['output'];
  actuatorType: Scalars['String']['output'];
  connectionState: Scalars['String']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  stateType: Scalars['String']['output'];
  unit?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type ActuatorStateDtoFilterInput = {
  actions?: InputMaybe<ListFilterInputTypeOfActuatorActionDtoFilterInput>;
  actuatorKey?: InputMaybe<StringOperationFilterInput>;
  actuatorType?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<ActuatorStateDtoFilterInput>>;
  connectionState?: InputMaybe<StringOperationFilterInput>;
  lastUpdate?: InputMaybe<DateTimeOperationFilterInput>;
  max?: InputMaybe<FloatOperationFilterInput>;
  min?: InputMaybe<FloatOperationFilterInput>;
  or?: InputMaybe<Array<ActuatorStateDtoFilterInput>>;
  state?: InputMaybe<StringOperationFilterInput>;
  stateType?: InputMaybe<StringOperationFilterInput>;
  unit?: InputMaybe<StringOperationFilterInput>;
  value?: InputMaybe<FloatOperationFilterInput>;
};

export enum ActuatorType {
  Hatch = 'HATCH',
  Pump = 'PUMP'
}

export type AddActuatorToBedInput = {
  actuatorId: Scalars['ID']['input'];
  bedId: Scalars['ID']['input'];
};

export type AddActuatorToBedPayload = {
  __typename?: 'AddActuatorToBedPayload';
  actuatorRef?: Maybe<ActuatorRef>;
};

export type AddSensorToBedInput = {
  bedId: Scalars['ID']['input'];
  sensorId: Scalars['ID']['input'];
};

export type AddSensorToBedPayload = {
  __typename?: 'AddSensorToBedPayload';
  sensorRef?: Maybe<SensorRef>;
};

export type AutomationRuleActionDto = {
  __typename?: 'AutomationRuleActionDto';
  actionKey: Scalars['String']['output'];
  actuatorId: Scalars['UUID']['output'];
  actuatorKey: Scalars['String']['output'];
  actuatorType: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  order: Scalars['Int']['output'];
  ruleId: Scalars['UUID']['output'];
  value?: Maybe<Scalars['Float']['output']>;
};

export type AutomationRuleActionDtoFilterInput = {
  actionKey?: InputMaybe<StringOperationFilterInput>;
  actuatorId?: InputMaybe<UuidOperationFilterInput>;
  actuatorKey?: InputMaybe<StringOperationFilterInput>;
  actuatorType?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<AutomationRuleActionDtoFilterInput>>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<AutomationRuleActionDtoFilterInput>>;
  order?: InputMaybe<IntOperationFilterInput>;
  ruleId?: InputMaybe<UuidOperationFilterInput>;
  value?: InputMaybe<FloatOperationFilterInput>;
};

export type AutomationRuleDto = {
  __typename?: 'AutomationRuleDto';
  actions: Array<AutomationRuleActionDto>;
  bedId: Scalars['UUID']['output'];
  expressionJson: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
};

export type AutomationRuleDtoFilterInput = {
  actions?: InputMaybe<ListFilterInputTypeOfAutomationRuleActionDtoFilterInput>;
  and?: InputMaybe<Array<AutomationRuleDtoFilterInput>>;
  bedId?: InputMaybe<UuidOperationFilterInput>;
  expressionJson?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AutomationRuleDtoFilterInput>>;
};

export type BedDto = {
  __typename?: 'BedDto';
  actuators: Array<ActuatorRefDto>;
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  name: Scalars['String']['output'];
  plant: PlantRefDto;
  rules: Array<AutomationRuleDto>;
  sensors: Array<SensorRefDto>;
};

export type BedDtoFilterInput = {
  actuators?: InputMaybe<ListFilterInputTypeOfActuatorRefDtoFilterInput>;
  and?: InputMaybe<Array<BedDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BedDtoFilterInput>>;
  plant?: InputMaybe<PlantRefDtoFilterInput>;
  rules?: InputMaybe<ListFilterInputTypeOfAutomationRuleDtoFilterInput>;
  sensors?: InputMaybe<ListFilterInputTypeOfSensorRefDtoFilterInput>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type ExecuteActuatorActionInput = {
  actionKey: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type ExecuteActuatorActionPayload = {
  __typename?: 'ExecuteActuatorActionPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type FloatOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
  neq?: InputMaybe<Scalars['Float']['input']>;
  ngt?: InputMaybe<Scalars['Float']['input']>;
  ngte?: InputMaybe<Scalars['Float']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  nlt?: InputMaybe<Scalars['Float']['input']>;
  nlte?: InputMaybe<Scalars['Float']['input']>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type ListFilterInputTypeOfActuatorActionDtoFilterInput = {
  all?: InputMaybe<ActuatorActionDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ActuatorActionDtoFilterInput>;
  some?: InputMaybe<ActuatorActionDtoFilterInput>;
};

export type ListFilterInputTypeOfActuatorRefDtoFilterInput = {
  all?: InputMaybe<ActuatorRefDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ActuatorRefDtoFilterInput>;
  some?: InputMaybe<ActuatorRefDtoFilterInput>;
};

export type ListFilterInputTypeOfAutomationRuleActionDtoFilterInput = {
  all?: InputMaybe<AutomationRuleActionDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<AutomationRuleActionDtoFilterInput>;
  some?: InputMaybe<AutomationRuleActionDtoFilterInput>;
};

export type ListFilterInputTypeOfAutomationRuleDtoFilterInput = {
  all?: InputMaybe<AutomationRuleDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<AutomationRuleDtoFilterInput>;
  some?: InputMaybe<AutomationRuleDtoFilterInput>;
};

export type ListFilterInputTypeOfPlantSensorConfigDtoFilterInput = {
  all?: InputMaybe<PlantSensorConfigDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PlantSensorConfigDtoFilterInput>;
  some?: InputMaybe<PlantSensorConfigDtoFilterInput>;
};

export type ListFilterInputTypeOfSensorRefDtoFilterInput = {
  all?: InputMaybe<SensorRefDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<SensorRefDtoFilterInput>;
  some?: InputMaybe<SensorRefDtoFilterInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addActuatorToBed: AddActuatorToBedPayload;
  addSensorToBed: AddSensorToBedPayload;
  executeActuatorAction: ExecuteActuatorActionPayload;
  removeActuatorFromBed: RemoveActuatorFromBedPayload;
  removeSensorFromBed: RemoveSensorFromBedPayload;
  updateActuatorRef: UpdateActuatorRefPayload;
  updateSensorRef: UpdateSensorRefPayload;
};


export type MutationAddActuatorToBedArgs = {
  input: AddActuatorToBedInput;
};


export type MutationAddSensorToBedArgs = {
  input: AddSensorToBedInput;
};


export type MutationExecuteActuatorActionArgs = {
  input: ExecuteActuatorActionInput;
};


export type MutationRemoveActuatorFromBedArgs = {
  input: RemoveActuatorFromBedInput;
};


export type MutationRemoveSensorFromBedArgs = {
  input: RemoveSensorFromBedInput;
};


export type MutationUpdateActuatorRefArgs = {
  input: UpdateActuatorRefInput;
};


export type MutationUpdateSensorRefArgs = {
  input: UpdateSensorRefInput;
};

export type PlantDto = {
  __typename?: 'PlantDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  imageUrl: Scalars['String']['output'];
  name: Scalars['String']['output'];
  sensorConfigs: Array<PlantSensorConfigDto>;
};

export type PlantDtoFilterInput = {
  and?: InputMaybe<Array<PlantDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PlantDtoFilterInput>>;
  sensorConfigs?: InputMaybe<ListFilterInputTypeOfPlantSensorConfigDtoFilterInput>;
};

export type PlantRefDto = {
  __typename?: 'PlantRefDto';
  id: Scalars['UUID']['output'];
};

export type PlantRefDtoFilterInput = {
  and?: InputMaybe<Array<PlantRefDtoFilterInput>>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<PlantRefDtoFilterInput>>;
};

export type PlantSensorConfigDto = {
  __typename?: 'PlantSensorConfigDto';
  rangeFrom: Scalars['Float']['output'];
  rangeTo: Scalars['Float']['output'];
  sensorType: Scalars['String']['output'];
};

export type PlantSensorConfigDtoFilterInput = {
  and?: InputMaybe<Array<PlantSensorConfigDtoFilterInput>>;
  or?: InputMaybe<Array<PlantSensorConfigDtoFilterInput>>;
  rangeFrom?: InputMaybe<FloatOperationFilterInput>;
  rangeTo?: InputMaybe<FloatOperationFilterInput>;
  sensorType?: InputMaybe<StringOperationFilterInput>;
};

export type Query = {
  __typename?: 'Query';
  actuator?: Maybe<ActuatorDto>;
  actuators: Array<ActuatorRefDto>;
  bed?: Maybe<BedDto>;
  beds: Array<BedDto>;
  plant?: Maybe<PlantDto>;
  plants: Array<PlantDto>;
  sensor?: Maybe<SensorDto>;
  sensors: Array<SensorRefDto>;
};


export type QueryActuatorArgs = {
  id: Scalars['UUID']['input'];
  where?: InputMaybe<ActuatorDtoFilterInput>;
};


export type QueryActuatorsArgs = {
  where?: InputMaybe<ActuatorRefDtoFilterInput>;
};


export type QueryBedArgs = {
  id: Scalars['UUID']['input'];
  where?: InputMaybe<BedDtoFilterInput>;
};


export type QueryBedsArgs = {
  where?: InputMaybe<BedDtoFilterInput>;
};


export type QueryPlantArgs = {
  id: Scalars['UUID']['input'];
  where?: InputMaybe<PlantDtoFilterInput>;
};


export type QueryPlantsArgs = {
  where?: InputMaybe<PlantDtoFilterInput>;
};


export type QuerySensorArgs = {
  id: Scalars['UUID']['input'];
  where?: InputMaybe<SensorDtoFilterInput>;
};


export type QuerySensorsArgs = {
  where?: InputMaybe<SensorRefDtoFilterInput>;
};

export type RemoveActuatorFromBedInput = {
  actuatorId: Scalars['ID']['input'];
  bedId: Scalars['ID']['input'];
};

export type RemoveActuatorFromBedPayload = {
  __typename?: 'RemoveActuatorFromBedPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RemoveSensorFromBedInput = {
  bedId: Scalars['ID']['input'];
  sensorId: Scalars['ID']['input'];
};

export type RemoveSensorFromBedPayload = {
  __typename?: 'RemoveSensorFromBedPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type SensorDataDto = {
  __typename?: 'SensorDataDto';
  connectionState: Scalars['String']['output'];
  currentValue: Scalars['Float']['output'];
  lastUpdate: Scalars['DateTime']['output'];
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
  sensorKey: Scalars['String']['output'];
  sensorType: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type SensorDto = {
  __typename?: 'SensorDto';
  currentValue: Scalars['Float']['output'];
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  key?: Maybe<Scalars['String']['output']>;
  maxValue: Scalars['Float']['output'];
  minValue: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type SensorDtoFilterInput = {
  and?: InputMaybe<Array<SensorDtoFilterInput>>;
  currentValue?: InputMaybe<FloatOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  maxValue?: InputMaybe<FloatOperationFilterInput>;
  minValue?: InputMaybe<FloatOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SensorDtoFilterInput>>;
  type?: InputMaybe<StringOperationFilterInput>;
  unit?: InputMaybe<StringOperationFilterInput>;
};

export type SensorRef = {
  __typename?: 'SensorRef';
  connectorKey?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isDeleted: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  topic?: Maybe<Scalars['String']['output']>;
  type: SensorType;
};

export type SensorRefDto = {
  __typename?: 'SensorRefDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  key?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type SensorRefDtoFilterInput = {
  and?: InputMaybe<Array<SensorRefDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SensorRefDtoFilterInput>>;
  type?: InputMaybe<StringOperationFilterInput>;
};

export enum SensorType {
  Humidity = 'HUMIDITY',
  Moisture = 'MOISTURE',
  Temperature = 'TEMPERATURE'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onActuatorStateChanged: ActuatorStateDto;
  onSensorMeasurement: SensorDataDto;
};

export type UpdateActuatorRefInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateActuatorRefPayload = {
  __typename?: 'UpdateActuatorRefPayload';
  actuatorRef?: Maybe<ActuatorRef>;
};

export type UpdateSensorRefInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSensorRefPayload = {
  __typename?: 'UpdateSensorRefPayload';
  sensorRef?: Maybe<SensorRef>;
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  gt?: InputMaybe<Scalars['UUID']['input']>;
  gte?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  lt?: InputMaybe<Scalars['UUID']['input']>;
  lte?: InputMaybe<Scalars['UUID']['input']>;
  neq?: InputMaybe<Scalars['UUID']['input']>;
  ngt?: InputMaybe<Scalars['UUID']['input']>;
  ngte?: InputMaybe<Scalars['UUID']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  nlt?: InputMaybe<Scalars['UUID']['input']>;
  nlte?: InputMaybe<Scalars['UUID']['input']>;
};

export type GetSensorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSensorsQuery = { __typename?: 'Query', sensors: Array<{ __typename?: 'SensorRefDto', id: any, name: string, description: string, key?: string | null, type: string }> };

export type GetSensorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSensorByIdQuery = { __typename?: 'Query', sensor?: { __typename?: 'SensorDto', id: any, key?: string | null, name: string, type: string, description: string, currentValue: number, maxValue: number, minValue: number, unit: string } | null };


export const GetSensorsDocument = gql`
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

/**
 * __useGetSensorsQuery__
 *
 * To run a query within a React component, call `useGetSensorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSensorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSensorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSensorsQuery(baseOptions?: Apollo.QueryHookOptions<GetSensorsQuery, GetSensorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSensorsQuery, GetSensorsQueryVariables>(GetSensorsDocument, options);
      }
export function useGetSensorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSensorsQuery, GetSensorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSensorsQuery, GetSensorsQueryVariables>(GetSensorsDocument, options);
        }
export function useGetSensorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSensorsQuery, GetSensorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSensorsQuery, GetSensorsQueryVariables>(GetSensorsDocument, options);
        }
export type GetSensorsQueryHookResult = ReturnType<typeof useGetSensorsQuery>;
export type GetSensorsLazyQueryHookResult = ReturnType<typeof useGetSensorsLazyQuery>;
export type GetSensorsSuspenseQueryHookResult = ReturnType<typeof useGetSensorsSuspenseQuery>;
export type GetSensorsQueryResult = Apollo.QueryResult<GetSensorsQuery, GetSensorsQueryVariables>;
export const GetSensorByIdDocument = gql`
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

/**
 * __useGetSensorByIdQuery__
 *
 * To run a query within a React component, call `useGetSensorByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSensorByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSensorByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSensorByIdQuery(baseOptions: Apollo.QueryHookOptions<GetSensorByIdQuery, GetSensorByIdQueryVariables> & ({ variables: GetSensorByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSensorByIdQuery, GetSensorByIdQueryVariables>(GetSensorByIdDocument, options);
      }
export function useGetSensorByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSensorByIdQuery, GetSensorByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSensorByIdQuery, GetSensorByIdQueryVariables>(GetSensorByIdDocument, options);
        }
export function useGetSensorByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSensorByIdQuery, GetSensorByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSensorByIdQuery, GetSensorByIdQueryVariables>(GetSensorByIdDocument, options);
        }
export type GetSensorByIdQueryHookResult = ReturnType<typeof useGetSensorByIdQuery>;
export type GetSensorByIdLazyQueryHookResult = ReturnType<typeof useGetSensorByIdLazyQuery>;
export type GetSensorByIdSuspenseQueryHookResult = ReturnType<typeof useGetSensorByIdSuspenseQuery>;
export type GetSensorByIdQueryResult = Apollo.QueryResult<GetSensorByIdQuery, GetSensorByIdQueryVariables>;