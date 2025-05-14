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
  setPlantToBed: SetPlantToBedPayload;
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


export type MutationSetPlantToBedArgs = {
  input: SetPlantToBedInput;
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

export type SetPlantToBedInput = {
  bedId: Scalars['ID']['input'];
  plantId: Scalars['ID']['input'];
};

export type SetPlantToBedPayload = {
  __typename?: 'SetPlantToBedPayload';
  bedDto?: Maybe<BedDto>;
};

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


export type SubscriptionOnActuatorStateChangedArgs = {
  key: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type SubscriptionOnSensorMeasurementArgs = {
  key: Scalars['String']['input'];
  type: Scalars['String']['input'];
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

export type GetActuatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActuatorsQuery = { __typename?: 'Query', actuators: Array<{ __typename?: 'ActuatorRefDto', id: any, name: string, description: string, key: string, type: string }> };

export type GetActuatorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetActuatorByIdQuery = { __typename?: 'Query', actuator?: { __typename?: 'ActuatorDto', id: any, key: string, name: string, description: string, type: string, state: { __typename?: 'ActuatorStateDto', actuatorKey: string, actuatorType: string, connectionState: string, stateType: string, state?: string | null, value?: number | null, min?: number | null, max?: number | null, unit?: string | null, lastUpdate: any, actions: Array<{ __typename?: 'ActuatorActionDto', key: string, name: string, description: string, type: string, isAllowed: boolean, icon: string, currentValue?: number | null, min?: number | null, max?: number | null, increment?: number | null, unit?: string | null }> } } | null };

export type UpdateActuatorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateActuatorMutation = { __typename?: 'Mutation', updateActuatorRef: { __typename?: 'UpdateActuatorRefPayload', actuatorRef?: { __typename?: 'ActuatorRef', id: any, name: string, description?: string | null, connectorKey?: string | null, type: ActuatorType } | null } };

export type ExecuteActionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  actionKey: Scalars['String']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
}>;


export type ExecuteActionMutation = { __typename?: 'Mutation', executeActuatorAction: { __typename?: 'ExecuteActuatorActionPayload', boolean?: boolean | null } };

export type ListenStateChangeSubscriptionVariables = Exact<{
  key: Scalars['String']['input'];
  type: Scalars['String']['input'];
}>;


export type ListenStateChangeSubscription = { __typename?: 'Subscription', onActuatorStateChanged: { __typename?: 'ActuatorStateDto', actuatorKey: string, actuatorType: string, connectionState: string, lastUpdate: any, max?: number | null, min?: number | null, state?: string | null, stateType: string, unit?: string | null, value?: number | null, actions: Array<{ __typename?: 'ActuatorActionDto', currentValue?: number | null, description: string, icon: string, increment?: number | null, isAllowed: boolean, key: string, max?: number | null, min?: number | null, name: string, type: string, unit?: string | null }> } };

export type GetBedByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBedByIdQuery = { __typename?: 'Query', bed?: { __typename?: 'BedDto', id: any, name: string, description: string, plant: { __typename?: 'PlantRefDto', id: any }, sensors: Array<{ __typename?: 'SensorRefDto', id: any, name: string, description: string, key?: string | null, type: string }>, actuators: Array<{ __typename?: 'ActuatorRefDto', id: any, name: string, description: string, key: string, type: string }>, rules: Array<{ __typename?: 'AutomationRuleDto', id: any, name: string, expressionJson: string, actions: Array<{ __typename?: 'AutomationRuleActionDto', id: any, ruleId: any, actuatorId: any, actuatorKey: string, actuatorType: string, actionKey: string, value?: number | null, order: number }> }> } | null };

export type SetCurrentPlantMutationVariables = Exact<{
  bedId: Scalars['ID']['input'];
  plantId: Scalars['ID']['input'];
}>;


export type SetCurrentPlantMutation = { __typename?: 'Mutation', setPlantToBed: { __typename?: 'SetPlantToBedPayload', bedDto?: { __typename?: 'BedDto', id: any } | null } };

export type AddSensorToBedMutationVariables = Exact<{
  bedId: Scalars['ID']['input'];
  sensorId: Scalars['ID']['input'];
}>;


export type AddSensorToBedMutation = { __typename?: 'Mutation', addSensorToBed: { __typename?: 'AddSensorToBedPayload', sensorRef?: { __typename?: 'SensorRef', id: any } | null } };

export type RemoveSensorFromBedMutationVariables = Exact<{
  bedId: Scalars['ID']['input'];
  sensorId: Scalars['ID']['input'];
}>;


export type RemoveSensorFromBedMutation = { __typename?: 'Mutation', removeSensorFromBed: { __typename?: 'RemoveSensorFromBedPayload', boolean?: boolean | null } };

export type AddActuatorToBedMutationVariables = Exact<{
  bedId: Scalars['ID']['input'];
  actuatorId: Scalars['ID']['input'];
}>;


export type AddActuatorToBedMutation = { __typename?: 'Mutation', addActuatorToBed: { __typename?: 'AddActuatorToBedPayload', actuatorRef?: { __typename?: 'ActuatorRef', id: any } | null } };

export type RemoveActuatorFromBedMutationVariables = Exact<{
  bedId: Scalars['ID']['input'];
  actuatorId: Scalars['ID']['input'];
}>;


export type RemoveActuatorFromBedMutation = { __typename?: 'Mutation', removeActuatorFromBed: { __typename?: 'RemoveActuatorFromBedPayload', boolean?: boolean | null } };

export type GetPlantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlantsQuery = { __typename?: 'Query', plants: Array<{ __typename?: 'PlantDto', id: any, name: string, description: string, imageUrl: string, sensorConfigs: Array<{ __typename?: 'PlantSensorConfigDto', sensorType: string, rangeFrom: number, rangeTo: number }> }> };

export type GetPlantByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetPlantByIdQuery = { __typename?: 'Query', plant?: { __typename?: 'PlantDto', id: any, name: string, description: string, imageUrl: string, sensorConfigs: Array<{ __typename?: 'PlantSensorConfigDto', sensorType: string, rangeFrom: number, rangeTo: number }> } | null };

export type GetSensorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSensorsQuery = { __typename?: 'Query', sensors: Array<{ __typename?: 'SensorRefDto', id: any, name: string, description: string, key?: string | null, type: string }> };

export type GetSensorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSensorByIdQuery = { __typename?: 'Query', sensor?: { __typename?: 'SensorDto', id: any, key?: string | null, name: string, type: string, description: string, currentValue: number, maxValue: number, minValue: number, unit: string } | null };

export type UpdateSensorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateSensorMutation = { __typename?: 'Mutation', updateSensorRef: { __typename?: 'UpdateSensorRefPayload', sensorRef?: { __typename?: 'SensorRef', connectorKey?: string | null, description?: string | null, id: any, isDeleted: boolean, name: string, order: number, topic?: string | null, type: SensorType } | null } };

export type ListenMeasurementSubscriptionVariables = Exact<{
  key: Scalars['String']['input'];
  type: Scalars['String']['input'];
}>;


export type ListenMeasurementSubscription = { __typename?: 'Subscription', onSensorMeasurement: { __typename?: 'SensorDataDto', sensorKey: string, sensorType: string, connectionState: string, currentValue: number, min: number, max: number, unit: string, lastUpdate: any } };


export const GetActuatorsDocument = gql`
    query getActuators {
  actuators {
    id
    name
    description
    key
    type
  }
}
    `;

/**
 * __useGetActuatorsQuery__
 *
 * To run a query within a React component, call `useGetActuatorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActuatorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActuatorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetActuatorsQuery(baseOptions?: Apollo.QueryHookOptions<GetActuatorsQuery, GetActuatorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActuatorsQuery, GetActuatorsQueryVariables>(GetActuatorsDocument, options);
      }
export function useGetActuatorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActuatorsQuery, GetActuatorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActuatorsQuery, GetActuatorsQueryVariables>(GetActuatorsDocument, options);
        }
export function useGetActuatorsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetActuatorsQuery, GetActuatorsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetActuatorsQuery, GetActuatorsQueryVariables>(GetActuatorsDocument, options);
        }
export type GetActuatorsQueryHookResult = ReturnType<typeof useGetActuatorsQuery>;
export type GetActuatorsLazyQueryHookResult = ReturnType<typeof useGetActuatorsLazyQuery>;
export type GetActuatorsSuspenseQueryHookResult = ReturnType<typeof useGetActuatorsSuspenseQuery>;
export type GetActuatorsQueryResult = Apollo.QueryResult<GetActuatorsQuery, GetActuatorsQueryVariables>;
export const GetActuatorByIdDocument = gql`
    query getActuatorById($id: UUID!) {
  actuator(id: $id) {
    id
    key
    name
    description
    type
    state {
      actuatorKey
      actuatorType
      connectionState
      stateType
      state
      value
      min
      max
      unit
      lastUpdate
      actions {
        key
        name
        description
        type
        isAllowed
        icon
        currentValue
        min
        max
        increment
        unit
      }
    }
  }
}
    `;

/**
 * __useGetActuatorByIdQuery__
 *
 * To run a query within a React component, call `useGetActuatorByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActuatorByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActuatorByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetActuatorByIdQuery(baseOptions: Apollo.QueryHookOptions<GetActuatorByIdQuery, GetActuatorByIdQueryVariables> & ({ variables: GetActuatorByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActuatorByIdQuery, GetActuatorByIdQueryVariables>(GetActuatorByIdDocument, options);
      }
export function useGetActuatorByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActuatorByIdQuery, GetActuatorByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActuatorByIdQuery, GetActuatorByIdQueryVariables>(GetActuatorByIdDocument, options);
        }
export function useGetActuatorByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetActuatorByIdQuery, GetActuatorByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetActuatorByIdQuery, GetActuatorByIdQueryVariables>(GetActuatorByIdDocument, options);
        }
export type GetActuatorByIdQueryHookResult = ReturnType<typeof useGetActuatorByIdQuery>;
export type GetActuatorByIdLazyQueryHookResult = ReturnType<typeof useGetActuatorByIdLazyQuery>;
export type GetActuatorByIdSuspenseQueryHookResult = ReturnType<typeof useGetActuatorByIdSuspenseQuery>;
export type GetActuatorByIdQueryResult = Apollo.QueryResult<GetActuatorByIdQuery, GetActuatorByIdQueryVariables>;
export const UpdateActuatorDocument = gql`
    mutation updateActuator($id: ID!, $name: String, $description: String) {
  updateActuatorRef(input: {id: $id, name: $name, description: $description}) {
    actuatorRef {
      id
      name
      description
      connectorKey
      type
    }
  }
}
    `;
export type UpdateActuatorMutationFn = Apollo.MutationFunction<UpdateActuatorMutation, UpdateActuatorMutationVariables>;

/**
 * __useUpdateActuatorMutation__
 *
 * To run a mutation, you first call `useUpdateActuatorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateActuatorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateActuatorMutation, { data, loading, error }] = useUpdateActuatorMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateActuatorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateActuatorMutation, UpdateActuatorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateActuatorMutation, UpdateActuatorMutationVariables>(UpdateActuatorDocument, options);
      }
export type UpdateActuatorMutationHookResult = ReturnType<typeof useUpdateActuatorMutation>;
export type UpdateActuatorMutationResult = Apollo.MutationResult<UpdateActuatorMutation>;
export type UpdateActuatorMutationOptions = Apollo.BaseMutationOptions<UpdateActuatorMutation, UpdateActuatorMutationVariables>;
export const ExecuteActionDocument = gql`
    mutation executeAction($id: ID!, $actionKey: String!, $value: Float) {
  executeActuatorAction(input: {id: $id, actionKey: $actionKey, value: $value}) {
    boolean
  }
}
    `;
export type ExecuteActionMutationFn = Apollo.MutationFunction<ExecuteActionMutation, ExecuteActionMutationVariables>;

/**
 * __useExecuteActionMutation__
 *
 * To run a mutation, you first call `useExecuteActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeActionMutation, { data, loading, error }] = useExecuteActionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      actionKey: // value for 'actionKey'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useExecuteActionMutation(baseOptions?: Apollo.MutationHookOptions<ExecuteActionMutation, ExecuteActionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExecuteActionMutation, ExecuteActionMutationVariables>(ExecuteActionDocument, options);
      }
export type ExecuteActionMutationHookResult = ReturnType<typeof useExecuteActionMutation>;
export type ExecuteActionMutationResult = Apollo.MutationResult<ExecuteActionMutation>;
export type ExecuteActionMutationOptions = Apollo.BaseMutationOptions<ExecuteActionMutation, ExecuteActionMutationVariables>;
export const ListenStateChangeDocument = gql`
    subscription listenStateChange($key: String!, $type: String!) {
  onActuatorStateChanged(key: $key, type: $type) {
    actuatorKey
    actuatorType
    connectionState
    lastUpdate
    max
    min
    state
    stateType
    unit
    value
    actions {
      currentValue
      description
      icon
      increment
      isAllowed
      key
      max
      min
      name
      type
      unit
    }
  }
}
    `;

/**
 * __useListenStateChangeSubscription__
 *
 * To run a query within a React component, call `useListenStateChangeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useListenStateChangeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListenStateChangeSubscription({
 *   variables: {
 *      key: // value for 'key'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useListenStateChangeSubscription(baseOptions: Apollo.SubscriptionHookOptions<ListenStateChangeSubscription, ListenStateChangeSubscriptionVariables> & ({ variables: ListenStateChangeSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ListenStateChangeSubscription, ListenStateChangeSubscriptionVariables>(ListenStateChangeDocument, options);
      }
export type ListenStateChangeSubscriptionHookResult = ReturnType<typeof useListenStateChangeSubscription>;
export type ListenStateChangeSubscriptionResult = Apollo.SubscriptionResult<ListenStateChangeSubscription>;
export const GetBedByIdDocument = gql`
    query getBedById($id: UUID!) {
  bed(id: $id) {
    id
    name
    description
    plant {
      id
    }
    sensors {
      id
      name
      description
      key
      type
    }
    actuators {
      id
      name
      description
      key
      type
    }
    rules {
      id
      name
      expressionJson
      actions {
        id
        ruleId
        actuatorId
        actuatorKey
        actuatorType
        actionKey
        value
        order
      }
    }
  }
}
    `;

/**
 * __useGetBedByIdQuery__
 *
 * To run a query within a React component, call `useGetBedByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBedByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBedByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBedByIdQuery(baseOptions: Apollo.QueryHookOptions<GetBedByIdQuery, GetBedByIdQueryVariables> & ({ variables: GetBedByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBedByIdQuery, GetBedByIdQueryVariables>(GetBedByIdDocument, options);
      }
export function useGetBedByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBedByIdQuery, GetBedByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBedByIdQuery, GetBedByIdQueryVariables>(GetBedByIdDocument, options);
        }
export function useGetBedByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBedByIdQuery, GetBedByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBedByIdQuery, GetBedByIdQueryVariables>(GetBedByIdDocument, options);
        }
export type GetBedByIdQueryHookResult = ReturnType<typeof useGetBedByIdQuery>;
export type GetBedByIdLazyQueryHookResult = ReturnType<typeof useGetBedByIdLazyQuery>;
export type GetBedByIdSuspenseQueryHookResult = ReturnType<typeof useGetBedByIdSuspenseQuery>;
export type GetBedByIdQueryResult = Apollo.QueryResult<GetBedByIdQuery, GetBedByIdQueryVariables>;
export const SetCurrentPlantDocument = gql`
    mutation setCurrentPlant($bedId: ID!, $plantId: ID!) {
  setPlantToBed(input: {bedId: $bedId, plantId: $plantId}) {
    bedDto {
      id
    }
  }
}
    `;
export type SetCurrentPlantMutationFn = Apollo.MutationFunction<SetCurrentPlantMutation, SetCurrentPlantMutationVariables>;

/**
 * __useSetCurrentPlantMutation__
 *
 * To run a mutation, you first call `useSetCurrentPlantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCurrentPlantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCurrentPlantMutation, { data, loading, error }] = useSetCurrentPlantMutation({
 *   variables: {
 *      bedId: // value for 'bedId'
 *      plantId: // value for 'plantId'
 *   },
 * });
 */
export function useSetCurrentPlantMutation(baseOptions?: Apollo.MutationHookOptions<SetCurrentPlantMutation, SetCurrentPlantMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetCurrentPlantMutation, SetCurrentPlantMutationVariables>(SetCurrentPlantDocument, options);
      }
export type SetCurrentPlantMutationHookResult = ReturnType<typeof useSetCurrentPlantMutation>;
export type SetCurrentPlantMutationResult = Apollo.MutationResult<SetCurrentPlantMutation>;
export type SetCurrentPlantMutationOptions = Apollo.BaseMutationOptions<SetCurrentPlantMutation, SetCurrentPlantMutationVariables>;
export const AddSensorToBedDocument = gql`
    mutation addSensorToBed($bedId: ID!, $sensorId: ID!) {
  addSensorToBed(input: {bedId: $bedId, sensorId: $sensorId}) {
    sensorRef {
      id
    }
  }
}
    `;
export type AddSensorToBedMutationFn = Apollo.MutationFunction<AddSensorToBedMutation, AddSensorToBedMutationVariables>;

/**
 * __useAddSensorToBedMutation__
 *
 * To run a mutation, you first call `useAddSensorToBedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddSensorToBedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addSensorToBedMutation, { data, loading, error }] = useAddSensorToBedMutation({
 *   variables: {
 *      bedId: // value for 'bedId'
 *      sensorId: // value for 'sensorId'
 *   },
 * });
 */
export function useAddSensorToBedMutation(baseOptions?: Apollo.MutationHookOptions<AddSensorToBedMutation, AddSensorToBedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddSensorToBedMutation, AddSensorToBedMutationVariables>(AddSensorToBedDocument, options);
      }
export type AddSensorToBedMutationHookResult = ReturnType<typeof useAddSensorToBedMutation>;
export type AddSensorToBedMutationResult = Apollo.MutationResult<AddSensorToBedMutation>;
export type AddSensorToBedMutationOptions = Apollo.BaseMutationOptions<AddSensorToBedMutation, AddSensorToBedMutationVariables>;
export const RemoveSensorFromBedDocument = gql`
    mutation removeSensorFromBed($bedId: ID!, $sensorId: ID!) {
  removeSensorFromBed(input: {bedId: $bedId, sensorId: $sensorId}) {
    boolean
  }
}
    `;
export type RemoveSensorFromBedMutationFn = Apollo.MutationFunction<RemoveSensorFromBedMutation, RemoveSensorFromBedMutationVariables>;

/**
 * __useRemoveSensorFromBedMutation__
 *
 * To run a mutation, you first call `useRemoveSensorFromBedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSensorFromBedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSensorFromBedMutation, { data, loading, error }] = useRemoveSensorFromBedMutation({
 *   variables: {
 *      bedId: // value for 'bedId'
 *      sensorId: // value for 'sensorId'
 *   },
 * });
 */
export function useRemoveSensorFromBedMutation(baseOptions?: Apollo.MutationHookOptions<RemoveSensorFromBedMutation, RemoveSensorFromBedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveSensorFromBedMutation, RemoveSensorFromBedMutationVariables>(RemoveSensorFromBedDocument, options);
      }
export type RemoveSensorFromBedMutationHookResult = ReturnType<typeof useRemoveSensorFromBedMutation>;
export type RemoveSensorFromBedMutationResult = Apollo.MutationResult<RemoveSensorFromBedMutation>;
export type RemoveSensorFromBedMutationOptions = Apollo.BaseMutationOptions<RemoveSensorFromBedMutation, RemoveSensorFromBedMutationVariables>;
export const AddActuatorToBedDocument = gql`
    mutation addActuatorToBed($bedId: ID!, $actuatorId: ID!) {
  addActuatorToBed(input: {bedId: $bedId, actuatorId: $actuatorId}) {
    actuatorRef {
      id
    }
  }
}
    `;
export type AddActuatorToBedMutationFn = Apollo.MutationFunction<AddActuatorToBedMutation, AddActuatorToBedMutationVariables>;

/**
 * __useAddActuatorToBedMutation__
 *
 * To run a mutation, you first call `useAddActuatorToBedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddActuatorToBedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addActuatorToBedMutation, { data, loading, error }] = useAddActuatorToBedMutation({
 *   variables: {
 *      bedId: // value for 'bedId'
 *      actuatorId: // value for 'actuatorId'
 *   },
 * });
 */
export function useAddActuatorToBedMutation(baseOptions?: Apollo.MutationHookOptions<AddActuatorToBedMutation, AddActuatorToBedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddActuatorToBedMutation, AddActuatorToBedMutationVariables>(AddActuatorToBedDocument, options);
      }
export type AddActuatorToBedMutationHookResult = ReturnType<typeof useAddActuatorToBedMutation>;
export type AddActuatorToBedMutationResult = Apollo.MutationResult<AddActuatorToBedMutation>;
export type AddActuatorToBedMutationOptions = Apollo.BaseMutationOptions<AddActuatorToBedMutation, AddActuatorToBedMutationVariables>;
export const RemoveActuatorFromBedDocument = gql`
    mutation removeActuatorFromBed($bedId: ID!, $actuatorId: ID!) {
  removeActuatorFromBed(input: {bedId: $bedId, actuatorId: $actuatorId}) {
    boolean
  }
}
    `;
export type RemoveActuatorFromBedMutationFn = Apollo.MutationFunction<RemoveActuatorFromBedMutation, RemoveActuatorFromBedMutationVariables>;

/**
 * __useRemoveActuatorFromBedMutation__
 *
 * To run a mutation, you first call `useRemoveActuatorFromBedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveActuatorFromBedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeActuatorFromBedMutation, { data, loading, error }] = useRemoveActuatorFromBedMutation({
 *   variables: {
 *      bedId: // value for 'bedId'
 *      actuatorId: // value for 'actuatorId'
 *   },
 * });
 */
export function useRemoveActuatorFromBedMutation(baseOptions?: Apollo.MutationHookOptions<RemoveActuatorFromBedMutation, RemoveActuatorFromBedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveActuatorFromBedMutation, RemoveActuatorFromBedMutationVariables>(RemoveActuatorFromBedDocument, options);
      }
export type RemoveActuatorFromBedMutationHookResult = ReturnType<typeof useRemoveActuatorFromBedMutation>;
export type RemoveActuatorFromBedMutationResult = Apollo.MutationResult<RemoveActuatorFromBedMutation>;
export type RemoveActuatorFromBedMutationOptions = Apollo.BaseMutationOptions<RemoveActuatorFromBedMutation, RemoveActuatorFromBedMutationVariables>;
export const GetPlantsDocument = gql`
    query getPlants {
  plants {
    id
    name
    description
    imageUrl
    sensorConfigs {
      sensorType
      rangeFrom
      rangeTo
    }
  }
}
    `;

/**
 * __useGetPlantsQuery__
 *
 * To run a query within a React component, call `useGetPlantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlantsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPlantsQuery(baseOptions?: Apollo.QueryHookOptions<GetPlantsQuery, GetPlantsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPlantsQuery, GetPlantsQueryVariables>(GetPlantsDocument, options);
      }
export function useGetPlantsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlantsQuery, GetPlantsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPlantsQuery, GetPlantsQueryVariables>(GetPlantsDocument, options);
        }
export function useGetPlantsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPlantsQuery, GetPlantsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPlantsQuery, GetPlantsQueryVariables>(GetPlantsDocument, options);
        }
export type GetPlantsQueryHookResult = ReturnType<typeof useGetPlantsQuery>;
export type GetPlantsLazyQueryHookResult = ReturnType<typeof useGetPlantsLazyQuery>;
export type GetPlantsSuspenseQueryHookResult = ReturnType<typeof useGetPlantsSuspenseQuery>;
export type GetPlantsQueryResult = Apollo.QueryResult<GetPlantsQuery, GetPlantsQueryVariables>;
export const GetPlantByIdDocument = gql`
    query getPlantById($id: UUID!) {
  plant(id: $id) {
    id
    name
    description
    imageUrl
    sensorConfigs {
      sensorType
      rangeFrom
      rangeTo
    }
  }
}
    `;

/**
 * __useGetPlantByIdQuery__
 *
 * To run a query within a React component, call `useGetPlantByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlantByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlantByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPlantByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPlantByIdQuery, GetPlantByIdQueryVariables> & ({ variables: GetPlantByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPlantByIdQuery, GetPlantByIdQueryVariables>(GetPlantByIdDocument, options);
      }
export function useGetPlantByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlantByIdQuery, GetPlantByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPlantByIdQuery, GetPlantByIdQueryVariables>(GetPlantByIdDocument, options);
        }
export function useGetPlantByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPlantByIdQuery, GetPlantByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPlantByIdQuery, GetPlantByIdQueryVariables>(GetPlantByIdDocument, options);
        }
export type GetPlantByIdQueryHookResult = ReturnType<typeof useGetPlantByIdQuery>;
export type GetPlantByIdLazyQueryHookResult = ReturnType<typeof useGetPlantByIdLazyQuery>;
export type GetPlantByIdSuspenseQueryHookResult = ReturnType<typeof useGetPlantByIdSuspenseQuery>;
export type GetPlantByIdQueryResult = Apollo.QueryResult<GetPlantByIdQuery, GetPlantByIdQueryVariables>;
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
export const UpdateSensorDocument = gql`
    mutation updateSensor($id: ID!, $name: String, $description: String) {
  updateSensorRef(input: {description: $description, id: $id, name: $name}) {
    sensorRef {
      connectorKey
      description
      id
      isDeleted
      name
      order
      topic
      type
    }
  }
}
    `;
export type UpdateSensorMutationFn = Apollo.MutationFunction<UpdateSensorMutation, UpdateSensorMutationVariables>;

/**
 * __useUpdateSensorMutation__
 *
 * To run a mutation, you first call `useUpdateSensorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSensorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSensorMutation, { data, loading, error }] = useUpdateSensorMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateSensorMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSensorMutation, UpdateSensorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSensorMutation, UpdateSensorMutationVariables>(UpdateSensorDocument, options);
      }
export type UpdateSensorMutationHookResult = ReturnType<typeof useUpdateSensorMutation>;
export type UpdateSensorMutationResult = Apollo.MutationResult<UpdateSensorMutation>;
export type UpdateSensorMutationOptions = Apollo.BaseMutationOptions<UpdateSensorMutation, UpdateSensorMutationVariables>;
export const ListenMeasurementDocument = gql`
    subscription listenMeasurement($key: String!, $type: String!) {
  onSensorMeasurement(key: $key, type: $type) {
    sensorKey
    sensorType
    connectionState
    currentValue
    min
    max
    unit
    lastUpdate
  }
}
    `;

/**
 * __useListenMeasurementSubscription__
 *
 * To run a query within a React component, call `useListenMeasurementSubscription` and pass it any options that fit your needs.
 * When your component renders, `useListenMeasurementSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListenMeasurementSubscription({
 *   variables: {
 *      key: // value for 'key'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useListenMeasurementSubscription(baseOptions: Apollo.SubscriptionHookOptions<ListenMeasurementSubscription, ListenMeasurementSubscriptionVariables> & ({ variables: ListenMeasurementSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ListenMeasurementSubscription, ListenMeasurementSubscriptionVariables>(ListenMeasurementDocument, options);
      }
export type ListenMeasurementSubscriptionHookResult = ReturnType<typeof useListenMeasurementSubscription>;
export type ListenMeasurementSubscriptionResult = Apollo.SubscriptionResult<ListenMeasurementSubscription>;