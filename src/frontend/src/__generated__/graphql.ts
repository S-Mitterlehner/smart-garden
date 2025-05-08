/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  UUID: { input: any; output: any; }
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

export type GraphQlQuery = {
  __typename?: 'GraphQLQuery';
  beds: Array<BedDto>;
  plants: Array<PlantDto>;
  sensorById: SensorDto;
};


export type GraphQlQueryBedsArgs = {
  where?: InputMaybe<BedDtoFilterInput>;
};


export type GraphQlQueryPlantsArgs = {
  where?: InputMaybe<PlantDtoFilterInput>;
};


export type GraphQlQuerySensorByIdArgs = {
  id: Scalars['UUID']['input'];
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
