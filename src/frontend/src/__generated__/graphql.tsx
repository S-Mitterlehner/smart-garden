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

export enum ActionIcons {
  Play = 'PLAY',
  Stop = 'STOP',
  Timer = 'TIMER'
}

export type ActionIconsOperationFilterInput = {
  eq?: InputMaybe<ActionIcons>;
  in?: InputMaybe<Array<ActionIcons>>;
  neq?: InputMaybe<ActionIcons>;
  nin?: InputMaybe<Array<ActionIcons>>;
};

export enum ActionType {
  Command = 'COMMAND',
  Value = 'VALUE'
}

export type ActionTypeOperationFilterInput = {
  eq?: InputMaybe<ActionType>;
  in?: InputMaybe<Array<ActionType>>;
  neq?: InputMaybe<ActionType>;
  nin?: InputMaybe<Array<ActionType>>;
};

export type ActuatorActionDto = {
  __typename?: 'ActuatorActionDto';
  currentValue?: Maybe<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  icon: ActionIcons;
  increment?: Maybe<Scalars['Float']['output']>;
  isAllowed: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  type: ActionType;
  unit?: Maybe<Scalars['String']['output']>;
};

export type ActuatorActionDtoFilterInput = {
  and?: InputMaybe<Array<ActuatorActionDtoFilterInput>>;
  currentValue?: InputMaybe<FloatOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  icon?: InputMaybe<ActionIconsOperationFilterInput>;
  increment?: InputMaybe<FloatOperationFilterInput>;
  isAllowed?: InputMaybe<BooleanOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  max?: InputMaybe<FloatOperationFilterInput>;
  min?: InputMaybe<FloatOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ActuatorActionDtoFilterInput>>;
  type?: InputMaybe<ActionTypeOperationFilterInput>;
  unit?: InputMaybe<StringOperationFilterInput>;
};

export type ActuatorDto = {
  __typename?: 'ActuatorDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  state: ActuatorStateDto;
  type: ModuleType;
};

export type ActuatorDtoFilterInput = {
  and?: InputMaybe<Array<ActuatorDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ActuatorDtoFilterInput>>;
  state?: InputMaybe<ActuatorStateDtoFilterInput>;
  type?: InputMaybe<ModuleTypeOperationFilterInput>;
};

export type ActuatorRefDto = {
  __typename?: 'ActuatorRefDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: ModuleType;
};

export type ActuatorRefDtoFilterInput = {
  and?: InputMaybe<Array<ActuatorRefDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ActuatorRefDtoFilterInput>>;
  type?: InputMaybe<ModuleTypeOperationFilterInput>;
};

export type ActuatorStateDto = {
  __typename?: 'ActuatorStateDto';
  actions: Array<ActuatorActionDto>;
  actuatorKey: Scalars['String']['output'];
  actuatorType: ModuleType;
  connectionState: ConnectionState;
  lastUpdate: Scalars['DateTime']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  stateType: StateType;
  unit?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type ActuatorStateDtoFilterInput = {
  actions?: InputMaybe<ListFilterInputTypeOfActuatorActionDtoFilterInput>;
  actuatorKey?: InputMaybe<StringOperationFilterInput>;
  actuatorType?: InputMaybe<ModuleTypeOperationFilterInput>;
  and?: InputMaybe<Array<ActuatorStateDtoFilterInput>>;
  connectionState?: InputMaybe<ConnectionStateOperationFilterInput>;
  lastUpdate?: InputMaybe<DateTimeOperationFilterInput>;
  max?: InputMaybe<FloatOperationFilterInput>;
  min?: InputMaybe<FloatOperationFilterInput>;
  or?: InputMaybe<Array<ActuatorStateDtoFilterInput>>;
  state?: InputMaybe<StringOperationFilterInput>;
  stateType?: InputMaybe<StateTypeOperationFilterInput>;
  unit?: InputMaybe<StringOperationFilterInput>;
  value?: InputMaybe<FloatOperationFilterInput>;
};

export type AddActuatorToBedInput = {
  actuatorId: Scalars['ID']['input'];
  bedId: Scalars['ID']['input'];
};

export type AddActuatorToBedPayload = {
  __typename?: 'AddActuatorToBedPayload';
  actuatorRefDto?: Maybe<ActuatorRefDto>;
};

export type AddAutomationRuleActionToModuleInput = {
  actionKey: Scalars['String']['input'];
  automationRuleId: Scalars['UUID']['input'];
  moduleId: Scalars['UUID']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type AddAutomationRuleActionToModulePayload = {
  __typename?: 'AddAutomationRuleActionToModulePayload';
  automationRuleActionDto?: Maybe<AutomationRuleActionDto>;
};

export type AddAutomationRuleToBedInput = {
  automationExpressionJson: Scalars['String']['input'];
  automationName: Scalars['String']['input'];
  bedId: Scalars['UUID']['input'];
  isEnabled: Scalars['Boolean']['input'];
};

export type AddAutomationRuleToBedPayload = {
  __typename?: 'AddAutomationRuleToBedPayload';
  automationRuleDto?: Maybe<AutomationRuleDto>;
};

export type AddModuleToBedInput = {
  bedId: Scalars['ID']['input'];
  moduleId: Scalars['ID']['input'];
};

export type AddModuleToBedPayload = {
  __typename?: 'AddModuleToBedPayload';
  moduleRefDto?: Maybe<ModuleRefDto>;
};

export type AddSensorToBedInput = {
  bedId: Scalars['ID']['input'];
  sensorId: Scalars['ID']['input'];
};

export type AddSensorToBedPayload = {
  __typename?: 'AddSensorToBedPayload';
  sensorRefDto?: Maybe<SensorRefDto>;
};

export type AutomationConfigDto = {
  __typename?: 'AutomationConfigDto';
  parameters: Array<ParameterGroupDto>;
};

export type AutomationRuleActionDto = {
  __typename?: 'AutomationRuleActionDto';
  actionKey?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  moduleId: Scalars['UUID']['output'];
  moduleKey?: Maybe<Scalars['String']['output']>;
  moduleType?: Maybe<ModuleType>;
  order?: Maybe<Scalars['Int']['output']>;
  ruleId: Scalars['UUID']['output'];
  value?: Maybe<Scalars['Float']['output']>;
};

export type AutomationRuleActionDtoFilterInput = {
  actionKey?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<AutomationRuleActionDtoFilterInput>>;
  id?: InputMaybe<UuidOperationFilterInput>;
  moduleId?: InputMaybe<UuidOperationFilterInput>;
  moduleKey?: InputMaybe<StringOperationFilterInput>;
  moduleType?: InputMaybe<NullableOfModuleTypeOperationFilterInput>;
  or?: InputMaybe<Array<AutomationRuleActionDtoFilterInput>>;
  order?: InputMaybe<IntOperationFilterInput>;
  ruleId?: InputMaybe<UuidOperationFilterInput>;
  value?: InputMaybe<FloatOperationFilterInput>;
};

export type AutomationRuleActionDtoInput = {
  actionKey?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
  moduleId: Scalars['UUID']['input'];
  moduleKey?: InputMaybe<Scalars['String']['input']>;
  moduleType?: InputMaybe<ModuleType>;
  order?: InputMaybe<Scalars['Int']['input']>;
  ruleId: Scalars['UUID']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type AutomationRuleDto = {
  __typename?: 'AutomationRuleDto';
  actions?: Maybe<Array<AutomationRuleActionDto>>;
  bedId: Scalars['UUID']['output'];
  expressionJson: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type AutomationRuleDtoFilterInput = {
  actions?: InputMaybe<ListFilterInputTypeOfAutomationRuleActionDtoFilterInput>;
  and?: InputMaybe<Array<AutomationRuleDtoFilterInput>>;
  bedId?: InputMaybe<UuidOperationFilterInput>;
  expressionJson?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  isEnabled?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AutomationRuleDtoFilterInput>>;
};

export type AutomationRuleDtoInput = {
  actions?: InputMaybe<Array<AutomationRuleActionDtoInput>>;
  bedId: Scalars['UUID']['input'];
  expressionJson: Scalars['String']['input'];
  id: Scalars['UUID']['input'];
  isEnabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
};

export type AutomationSelectValueDto = {
  __typename?: 'AutomationSelectValueDto';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type BedDto = {
  __typename?: 'BedDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  modules: Array<ModuleRefDto>;
  name: Scalars['String']['output'];
  plantId?: Maybe<Scalars['UUID']['output']>;
  rules: Array<AutomationRuleDto>;
};

export type BedDtoFilterInput = {
  and?: InputMaybe<Array<BedDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  modules?: InputMaybe<ListFilterInputTypeOfModuleRefDtoFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BedDtoFilterInput>>;
  plantId?: InputMaybe<UuidOperationFilterInput>;
  rules?: InputMaybe<ListFilterInputTypeOfAutomationRuleDtoFilterInput>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum ConnectionState {
  Connected = 'CONNECTED',
  NotConnected = 'NOT_CONNECTED'
}

export type ConnectionStateOperationFilterInput = {
  eq?: InputMaybe<ConnectionState>;
  in?: InputMaybe<Array<ConnectionState>>;
  neq?: InputMaybe<ConnectionState>;
  nin?: InputMaybe<Array<ConnectionState>>;
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

export type ExecuteModuleActionInput = {
  actionKey: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type ExecuteModuleActionPayload = {
  __typename?: 'ExecuteModuleActionPayload';
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

export type ListFilterInputTypeOfModuleActionDtoFilterInput = {
  all?: InputMaybe<ModuleActionDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ModuleActionDtoFilterInput>;
  some?: InputMaybe<ModuleActionDtoFilterInput>;
};

export type ListFilterInputTypeOfModuleRefDtoFilterInput = {
  all?: InputMaybe<ModuleRefDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ModuleRefDtoFilterInput>;
  some?: InputMaybe<ModuleRefDtoFilterInput>;
};

export type ListFilterInputTypeOfPlantModuleConfigDtoFilterInput = {
  all?: InputMaybe<PlantModuleConfigDtoFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<PlantModuleConfigDtoFilterInput>;
  some?: InputMaybe<PlantModuleConfigDtoFilterInput>;
};

export type ModuleActionDto = {
  __typename?: 'ModuleActionDto';
  currentValue?: Maybe<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  icon: ActionIcons;
  increment?: Maybe<Scalars['Float']['output']>;
  isAllowed: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  type: ActionType;
  unit?: Maybe<Scalars['String']['output']>;
};

export type ModuleActionDtoFilterInput = {
  and?: InputMaybe<Array<ModuleActionDtoFilterInput>>;
  currentValue?: InputMaybe<FloatOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  icon?: InputMaybe<ActionIconsOperationFilterInput>;
  increment?: InputMaybe<FloatOperationFilterInput>;
  isAllowed?: InputMaybe<BooleanOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  max?: InputMaybe<FloatOperationFilterInput>;
  min?: InputMaybe<FloatOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ModuleActionDtoFilterInput>>;
  type?: InputMaybe<ActionTypeOperationFilterInput>;
  unit?: InputMaybe<StringOperationFilterInput>;
};

export type ModuleDto = {
  __typename?: 'ModuleDto';
  description: Scalars['String']['output'];
  group: ModuleGroup;
  id: Scalars['UUID']['output'];
  isActuator: Scalars['Boolean']['output'];
  isSensor: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  state: ModuleStateDto;
  type: ModuleType;
};

export type ModuleDtoFilterInput = {
  and?: InputMaybe<Array<ModuleDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  group?: InputMaybe<ModuleGroupOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  isActuator?: InputMaybe<BooleanOperationFilterInput>;
  isSensor?: InputMaybe<BooleanOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ModuleDtoFilterInput>>;
  state?: InputMaybe<ModuleStateDtoFilterInput>;
  type?: InputMaybe<ModuleTypeOperationFilterInput>;
};

export enum ModuleGroup {
  Actuator = 'ACTUATOR',
  Sensor = 'SENSOR'
}

export type ModuleGroupOperationFilterInput = {
  eq?: InputMaybe<ModuleGroup>;
  in?: InputMaybe<Array<ModuleGroup>>;
  neq?: InputMaybe<ModuleGroup>;
  nin?: InputMaybe<Array<ModuleGroup>>;
};

export type ModuleRefDto = {
  __typename?: 'ModuleRefDto';
  description: Scalars['String']['output'];
  group: ModuleGroup;
  id: Scalars['UUID']['output'];
  isActuator: Scalars['Boolean']['output'];
  isSensor: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: ModuleType;
};

export type ModuleRefDtoFilterInput = {
  and?: InputMaybe<Array<ModuleRefDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  group?: InputMaybe<ModuleGroupOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  isActuator?: InputMaybe<BooleanOperationFilterInput>;
  isSensor?: InputMaybe<BooleanOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ModuleRefDtoFilterInput>>;
  type?: InputMaybe<ModuleTypeOperationFilterInput>;
};

export type ModuleStateDto = {
  __typename?: 'ModuleStateDto';
  actions: Array<ModuleActionDto>;
  connectionState: ConnectionState;
  lastUpdate: Scalars['DateTime']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  moduleKey: Scalars['String']['output'];
  moduleType: ModuleType;
  state?: Maybe<Scalars['String']['output']>;
  stateType: StateType;
  unit?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type ModuleStateDtoFilterInput = {
  actions?: InputMaybe<ListFilterInputTypeOfModuleActionDtoFilterInput>;
  and?: InputMaybe<Array<ModuleStateDtoFilterInput>>;
  connectionState?: InputMaybe<ConnectionStateOperationFilterInput>;
  lastUpdate?: InputMaybe<DateTimeOperationFilterInput>;
  max?: InputMaybe<FloatOperationFilterInput>;
  min?: InputMaybe<FloatOperationFilterInput>;
  moduleKey?: InputMaybe<StringOperationFilterInput>;
  moduleType?: InputMaybe<ModuleTypeOperationFilterInput>;
  or?: InputMaybe<Array<ModuleStateDtoFilterInput>>;
  state?: InputMaybe<StringOperationFilterInput>;
  stateType?: InputMaybe<StateTypeOperationFilterInput>;
  unit?: InputMaybe<StringOperationFilterInput>;
  value?: InputMaybe<FloatOperationFilterInput>;
};

export enum ModuleType {
  Hatch = 'HATCH',
  Humidity = 'HUMIDITY',
  Moisture = 'MOISTURE',
  Pump = 'PUMP',
  Temperature = 'TEMPERATURE'
}

export type ModuleTypeOperationFilterInput = {
  eq?: InputMaybe<ModuleType>;
  in?: InputMaybe<Array<ModuleType>>;
  neq?: InputMaybe<ModuleType>;
  nin?: InputMaybe<Array<ModuleType>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** @deprecated Use Module instead */
  addActuatorToBed: AddActuatorToBedPayload;
  /** @deprecated Will be changed to SaveAutomationRule in the future */
  addAutomationRuleActionToModule: AddAutomationRuleActionToModulePayload;
  /** @deprecated Will be changed to SaveAutomationRule in the future */
  addAutomationRuleToBed: AddAutomationRuleToBedPayload;
  addModuleToBed: AddModuleToBedPayload;
  /** @deprecated Use Module instead */
  addSensorToBed: AddSensorToBedPayload;
  /** @deprecated Use Module instead */
  executeActuatorAction: ExecuteActuatorActionPayload;
  executeModuleAction: ExecuteModuleActionPayload;
  /** @deprecated Use Module instead */
  removeActuatorFromBed: RemoveActuatorFromBedPayload;
  removeAutomationRule: RemoveAutomationRulePayload;
  /** @deprecated Will be changed to SaveAutomationRule in the future */
  removeAutomationRuleAction: RemoveAutomationRuleActionPayload;
  removeModuleFromBed: RemoveModuleFromBedPayload;
  /** @deprecated Use Module instead */
  removeSensorFromBed: RemoveSensorFromBedPayload;
  saveAutomationRule: SaveAutomationRulePayload;
  setPlantToBed: SetPlantToBedPayload;
  /** @deprecated Use Module instead */
  updateActuatorRef: UpdateActuatorRefPayload;
  /** @deprecated Will be changed to SaveAutomationRule in the future */
  updateAutomationRuleActionFromModule: UpdateAutomationRuleActionFromModulePayload;
  /** @deprecated Will be changed to SaveAutomationRule in the future */
  updateAutomationRuleFromBed: UpdateAutomationRuleFromBedPayload;
  updateModuleRef: UpdateModuleRefPayload;
  /** @deprecated Use Module instead */
  updateSensorRef: UpdateSensorRefPayload;
};


export type MutationAddActuatorToBedArgs = {
  input: AddActuatorToBedInput;
};


export type MutationAddAutomationRuleActionToModuleArgs = {
  input: AddAutomationRuleActionToModuleInput;
};


export type MutationAddAutomationRuleToBedArgs = {
  input: AddAutomationRuleToBedInput;
};


export type MutationAddModuleToBedArgs = {
  input: AddModuleToBedInput;
};


export type MutationAddSensorToBedArgs = {
  input: AddSensorToBedInput;
};


export type MutationExecuteActuatorActionArgs = {
  input: ExecuteActuatorActionInput;
};


export type MutationExecuteModuleActionArgs = {
  input: ExecuteModuleActionInput;
};


export type MutationRemoveActuatorFromBedArgs = {
  input: RemoveActuatorFromBedInput;
};


export type MutationRemoveAutomationRuleArgs = {
  input: RemoveAutomationRuleInput;
};


export type MutationRemoveAutomationRuleActionArgs = {
  input: RemoveAutomationRuleActionInput;
};


export type MutationRemoveModuleFromBedArgs = {
  input: RemoveModuleFromBedInput;
};


export type MutationRemoveSensorFromBedArgs = {
  input: RemoveSensorFromBedInput;
};


export type MutationSaveAutomationRuleArgs = {
  input: SaveAutomationRuleInput;
};


export type MutationSetPlantToBedArgs = {
  input: SetPlantToBedInput;
};


export type MutationUpdateActuatorRefArgs = {
  input: UpdateActuatorRefInput;
};


export type MutationUpdateAutomationRuleActionFromModuleArgs = {
  input: UpdateAutomationRuleActionFromModuleInput;
};


export type MutationUpdateAutomationRuleFromBedArgs = {
  input: UpdateAutomationRuleFromBedInput;
};


export type MutationUpdateModuleRefArgs = {
  input: UpdateModuleRefInput;
};


export type MutationUpdateSensorRefArgs = {
  input: UpdateSensorRefInput;
};

export type NullableOfModuleTypeOperationFilterInput = {
  eq?: InputMaybe<ModuleType>;
  in?: InputMaybe<Array<InputMaybe<ModuleType>>>;
  neq?: InputMaybe<ModuleType>;
  nin?: InputMaybe<Array<InputMaybe<ModuleType>>>;
};

export type ParameterFieldDto = {
  __typename?: 'ParameterFieldDto';
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  tsType?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  valueType: StateType;
  values: Array<AutomationSelectValueDto>;
};

export type ParameterGroupDto = {
  __typename?: 'ParameterGroupDto';
  fields: Array<ParameterFieldDto>;
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
};

export type PlantDto = {
  __typename?: 'PlantDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  imageUrl: Scalars['String']['output'];
  moduleConfigs: Array<PlantModuleConfigDto>;
  name: Scalars['String']['output'];
};

export type PlantDtoFilterInput = {
  and?: InputMaybe<Array<PlantDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  moduleConfigs?: InputMaybe<ListFilterInputTypeOfPlantModuleConfigDtoFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PlantDtoFilterInput>>;
};

export type PlantModuleConfigDto = {
  __typename?: 'PlantModuleConfigDto';
  moduleType: ModuleType;
  rangeFrom: Scalars['Float']['output'];
  rangeTo: Scalars['Float']['output'];
};

export type PlantModuleConfigDtoFilterInput = {
  and?: InputMaybe<Array<PlantModuleConfigDtoFilterInput>>;
  moduleType?: InputMaybe<ModuleTypeOperationFilterInput>;
  or?: InputMaybe<Array<PlantModuleConfigDtoFilterInput>>;
  rangeFrom?: InputMaybe<FloatOperationFilterInput>;
  rangeTo?: InputMaybe<FloatOperationFilterInput>;
};

export type Query = {
  __typename?: 'Query';
  /** @deprecated Use GetModule instead */
  actuator?: Maybe<ActuatorDto>;
  /** @deprecated Use GetModules instead */
  actuators: Array<ActuatorRefDto>;
  automationConfig?: Maybe<AutomationConfigDto>;
  bed?: Maybe<BedDto>;
  beds: Array<BedDto>;
  module?: Maybe<ModuleDto>;
  modules: Array<ModuleRefDto>;
  modulesInformation: Array<Maybe<ModuleDto>>;
  plant?: Maybe<PlantDto>;
  plants: Array<PlantDto>;
  rule?: Maybe<AutomationRuleDto>;
  rules: Array<AutomationRuleDto>;
  /** @deprecated Use GetModule instead */
  sensor?: Maybe<SensorDto>;
  /** @deprecated Use GetModule instead */
  sensors: Array<SensorRefDto>;
};


export type QueryActuatorArgs = {
  id: Scalars['UUID']['input'];
  where?: InputMaybe<ActuatorDtoFilterInput>;
};


export type QueryActuatorsArgs = {
  where?: InputMaybe<ActuatorRefDtoFilterInput>;
};


export type QueryAutomationConfigArgs = {
  bedId: Scalars['UUID']['input'];
};


export type QueryBedArgs = {
  id: Scalars['UUID']['input'];
  where?: InputMaybe<BedDtoFilterInput>;
};


export type QueryBedsArgs = {
  where?: InputMaybe<BedDtoFilterInput>;
};


export type QueryModuleArgs = {
  id: Scalars['UUID']['input'];
  where?: InputMaybe<ModuleDtoFilterInput>;
};


export type QueryModulesArgs = {
  group: ModuleGroup;
  where?: InputMaybe<ModuleRefDtoFilterInput>;
};


export type QueryModulesInformationArgs = {
  where?: InputMaybe<ModuleDtoFilterInput>;
};


export type QueryPlantArgs = {
  id: Scalars['UUID']['input'];
  where?: InputMaybe<PlantDtoFilterInput>;
};


export type QueryPlantsArgs = {
  where?: InputMaybe<PlantDtoFilterInput>;
};


export type QueryRuleArgs = {
  ruleId: Scalars['UUID']['input'];
};


export type QueryRulesArgs = {
  bedId: Scalars['UUID']['input'];
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

export type RemoveAutomationRuleActionInput = {
  actionId: Scalars['UUID']['input'];
};

export type RemoveAutomationRuleActionPayload = {
  __typename?: 'RemoveAutomationRuleActionPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RemoveAutomationRuleInput = {
  automationRuleId: Scalars['UUID']['input'];
};

export type RemoveAutomationRulePayload = {
  __typename?: 'RemoveAutomationRulePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
};

export type RemoveModuleFromBedInput = {
  bedId: Scalars['ID']['input'];
  moduleId: Scalars['ID']['input'];
};

export type RemoveModuleFromBedPayload = {
  __typename?: 'RemoveModuleFromBedPayload';
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

export type SaveAutomationRuleInput = {
  dto: AutomationRuleDtoInput;
};

export type SaveAutomationRulePayload = {
  __typename?: 'SaveAutomationRulePayload';
  automationRuleDto?: Maybe<AutomationRuleDto>;
};

export type SensorDataDto = {
  __typename?: 'SensorDataDto';
  connectionState: ConnectionState;
  currentValue?: Maybe<Scalars['Float']['output']>;
  lastUpdate: Scalars['DateTime']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  sensorKey: Scalars['String']['output'];
  sensorType: ModuleType;
  unit?: Maybe<Scalars['String']['output']>;
};

export type SensorDto = {
  __typename?: 'SensorDto';
  currentValue?: Maybe<Scalars['Float']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  key?: Maybe<Scalars['String']['output']>;
  maxValue?: Maybe<Scalars['Float']['output']>;
  minValue?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  type: ModuleType;
  unit?: Maybe<Scalars['String']['output']>;
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
  type?: InputMaybe<ModuleTypeOperationFilterInput>;
  unit?: InputMaybe<StringOperationFilterInput>;
};

export type SensorRefDto = {
  __typename?: 'SensorRefDto';
  description: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  key?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  type: ModuleType;
};

export type SensorRefDtoFilterInput = {
  and?: InputMaybe<Array<SensorRefDtoFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  key?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SensorRefDtoFilterInput>>;
  type?: InputMaybe<ModuleTypeOperationFilterInput>;
};

export type SetPlantToBedInput = {
  bedId: Scalars['ID']['input'];
  plantId: Scalars['ID']['input'];
};

export type SetPlantToBedPayload = {
  __typename?: 'SetPlantToBedPayload';
  bedDto?: Maybe<BedDto>;
};

export enum StateType {
  Continuous = 'CONTINUOUS',
  Discrete = 'DISCRETE'
}

export type StateTypeOperationFilterInput = {
  eq?: InputMaybe<StateType>;
  in?: InputMaybe<Array<StateType>>;
  neq?: InputMaybe<StateType>;
  nin?: InputMaybe<Array<StateType>>;
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
  /** @deprecated use module instead */
  onActuatorStateChanged: ActuatorStateDto;
  onModuleStateChanged: ModuleStateDto;
  /** @deprecated use module instead */
  onSensorMeasurement: SensorDataDto;
};


export type SubscriptionOnActuatorStateChangedArgs = {
  key: Scalars['String']['input'];
  type: ModuleType;
};


export type SubscriptionOnModuleStateChangedArgs = {
  key: Scalars['String']['input'];
  type: ModuleType;
};


export type SubscriptionOnSensorMeasurementArgs = {
  key: Scalars['String']['input'];
  type: ModuleType;
};

export type UpdateActuatorRefInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateActuatorRefPayload = {
  __typename?: 'UpdateActuatorRefPayload';
  actuatorRefDto?: Maybe<ActuatorRefDto>;
};

export type UpdateAutomationRuleActionFromModuleInput = {
  automationRuleActionDto: AutomationRuleActionDtoInput;
};

export type UpdateAutomationRuleActionFromModulePayload = {
  __typename?: 'UpdateAutomationRuleActionFromModulePayload';
  automationRuleActionDto?: Maybe<AutomationRuleActionDto>;
};

export type UpdateAutomationRuleFromBedInput = {
  automationRuleDto: AutomationRuleDtoInput;
};

export type UpdateAutomationRuleFromBedPayload = {
  __typename?: 'UpdateAutomationRuleFromBedPayload';
  automationRuleDto?: Maybe<AutomationRuleDto>;
};

export type UpdateModuleRefInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateModuleRefPayload = {
  __typename?: 'UpdateModuleRefPayload';
  moduleRefDto?: Maybe<ModuleRefDto>;
};

export type UpdateSensorRefInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSensorRefPayload = {
  __typename?: 'UpdateSensorRefPayload';
  sensorRefDto?: Maybe<SensorRefDto>;
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


export type GetActuatorsQuery = { __typename?: 'Query', actuators: Array<{ __typename?: 'ActuatorRefDto', id: any, name: string, description: string, key: string, type: ModuleType }> };

export type GetActuatorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetActuatorByIdQuery = { __typename?: 'Query', actuator?: { __typename?: 'ActuatorDto', id: any, key: string, name: string, description: string, type: ModuleType, state: { __typename?: 'ActuatorStateDto', actuatorKey: string, actuatorType: ModuleType, connectionState: ConnectionState, stateType: StateType, state?: string | null, value?: number | null, min?: number | null, max?: number | null, unit?: string | null, lastUpdate: any, actions: Array<{ __typename?: 'ActuatorActionDto', key: string, name: string, description: string, type: ActionType, isAllowed: boolean, icon: ActionIcons, currentValue?: number | null, min?: number | null, max?: number | null, increment?: number | null, unit?: string | null }> } } | null };

export type UpdateActuatorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateActuatorMutation = { __typename?: 'Mutation', updateActuatorRef: { __typename?: 'UpdateActuatorRefPayload', actuatorRefDto?: { __typename?: 'ActuatorRefDto', id: any, name: string, description: string, key: string, type: ModuleType } | null } };

export type ExecuteActuatorActionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  actionKey: Scalars['String']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
}>;


export type ExecuteActuatorActionMutation = { __typename?: 'Mutation', executeActuatorAction: { __typename?: 'ExecuteActuatorActionPayload', boolean?: boolean | null } };

export type ListenActuatorStateChangeSubscriptionVariables = Exact<{
  key: Scalars['String']['input'];
  type: ModuleType;
}>;


export type ListenActuatorStateChangeSubscription = { __typename?: 'Subscription', onActuatorStateChanged: { __typename?: 'ActuatorStateDto', actuatorKey: string, actuatorType: ModuleType, connectionState: ConnectionState, lastUpdate: any, max?: number | null, min?: number | null, state?: string | null, stateType: StateType, unit?: string | null, value?: number | null, actions: Array<{ __typename?: 'ActuatorActionDto', currentValue?: number | null, description: string, icon: ActionIcons, increment?: number | null, isAllowed: boolean, key: string, max?: number | null, min?: number | null, name: string, type: ActionType, unit?: string | null }> } };

export type GetAutomationConfigQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetAutomationConfigQuery = { __typename?: 'Query', automationConfig?: { __typename?: 'AutomationConfigDto', parameters: Array<{ __typename?: 'ParameterGroupDto', key: string, label: string, fields: Array<{ __typename?: 'ParameterFieldDto', key: string, label: string, max?: number | null, min?: number | null, tsType?: string | null, unit?: string | null, valueType: StateType, values: Array<{ __typename?: 'AutomationSelectValueDto', label: string, value: string }> }> }> } | null };

export type GetRulesFromBedQueryVariables = Exact<{
  bedId: Scalars['UUID']['input'];
}>;


export type GetRulesFromBedQuery = { __typename?: 'Query', rules: Array<{ __typename?: 'AutomationRuleDto', bedId: any, expressionJson: string, id: any, isEnabled: boolean, name: string, actions?: Array<{ __typename?: 'AutomationRuleActionDto', actionKey?: string | null, id: any, moduleId: any, moduleKey?: string | null, moduleType?: ModuleType | null, order?: number | null, ruleId: any, value?: number | null }> | null }> };

export type GetRuleByIdQueryVariables = Exact<{
  ruleId: Scalars['UUID']['input'];
}>;


export type GetRuleByIdQuery = { __typename?: 'Query', rule?: { __typename?: 'AutomationRuleDto', bedId: any, expressionJson: string, id: any, isEnabled: boolean, name: string, actions?: Array<{ __typename?: 'AutomationRuleActionDto', actionKey?: string | null, id: any, moduleId: any, moduleKey?: string | null, moduleType?: ModuleType | null, order?: number | null, ruleId: any, value?: number | null }> | null } | null };

export type SaveAutomationRuleMutationVariables = Exact<{
  input: SaveAutomationRuleInput;
}>;


export type SaveAutomationRuleMutation = { __typename?: 'Mutation', saveAutomationRule: { __typename?: 'SaveAutomationRulePayload', automationRuleDto?: { __typename?: 'AutomationRuleDto', bedId: any, expressionJson: string, id: any, isEnabled: boolean, name: string, actions?: Array<{ __typename?: 'AutomationRuleActionDto', ruleId: any, moduleId: any, moduleKey?: string | null, moduleType?: ModuleType | null, actionKey?: string | null, value?: number | null, order?: number | null, id: any }> | null } | null } };

export type RemoveAutomationRuleMutationVariables = Exact<{
  automationRuleId: Scalars['UUID']['input'];
}>;


export type RemoveAutomationRuleMutation = { __typename?: 'Mutation', removeAutomationRule: { __typename?: 'RemoveAutomationRulePayload', boolean?: boolean | null } };

export type GetBedByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetBedByIdQuery = { __typename?: 'Query', bed?: { __typename?: 'BedDto', id: any, name: string, description: string, plantId?: any | null, modules: Array<{ __typename?: 'ModuleRefDto', id: any, name: string, description: string, key: string, type: ModuleType, group: ModuleGroup, isActuator: boolean, isSensor: boolean }>, rules: Array<{ __typename?: 'AutomationRuleDto', id: any, name: string, expressionJson: string, isEnabled: boolean, actions?: Array<{ __typename?: 'AutomationRuleActionDto', id: any, ruleId: any, moduleId: any, moduleKey?: string | null, moduleType?: ModuleType | null, actionKey?: string | null, value?: number | null, order?: number | null }> | null }> } | null };

export type SetCurrentPlantMutationVariables = Exact<{
  bedId: Scalars['ID']['input'];
  plantId: Scalars['ID']['input'];
}>;


export type SetCurrentPlantMutation = { __typename?: 'Mutation', setPlantToBed: { __typename?: 'SetPlantToBedPayload', bedDto?: { __typename?: 'BedDto', id: any } | null } };

export type AddModuleToBedMutationVariables = Exact<{
  bedId: Scalars['ID']['input'];
  moduleId: Scalars['ID']['input'];
}>;


export type AddModuleToBedMutation = { __typename?: 'Mutation', addModuleToBed: { __typename?: 'AddModuleToBedPayload', moduleRefDto?: { __typename?: 'ModuleRefDto', id: any } | null } };

export type RemoveModuleFromBedMutationVariables = Exact<{
  bedId: Scalars['ID']['input'];
  moduleId: Scalars['ID']['input'];
}>;


export type RemoveModuleFromBedMutation = { __typename?: 'Mutation', removeModuleFromBed: { __typename?: 'RemoveModuleFromBedPayload', boolean?: boolean | null } };

export type GetModulesQueryVariables = Exact<{
  group: ModuleGroup;
}>;


export type GetModulesQuery = { __typename?: 'Query', modules: Array<{ __typename?: 'ModuleRefDto', id: any, name: string, description: string, key: string, type: ModuleType, group: ModuleGroup, isActuator: boolean, isSensor: boolean }> };

export type GetModuleByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetModuleByIdQuery = { __typename?: 'Query', module?: { __typename?: 'ModuleDto', id: any, key: string, name: string, description: string, type: ModuleType, group: ModuleGroup, isActuator: boolean, isSensor: boolean, state: { __typename?: 'ModuleStateDto', moduleKey: string, moduleType: ModuleType, connectionState: ConnectionState, stateType: StateType, state?: string | null, value?: number | null, min?: number | null, max?: number | null, unit?: string | null, lastUpdate: any, actions: Array<{ __typename?: 'ModuleActionDto', key: string, name: string, description: string, type: ActionType, isAllowed: boolean, icon: ActionIcons, currentValue?: number | null, min?: number | null, max?: number | null, increment?: number | null, unit?: string | null }> } } | null };

export type GetModulesInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModulesInformationQuery = { __typename?: 'Query', modulesInformation: Array<{ __typename?: 'ModuleDto', description: string, group: ModuleGroup, id: any, isActuator: boolean, key: string, name: string, type: ModuleType, isSensor: boolean, state: { __typename?: 'ModuleStateDto', actions: Array<{ __typename?: 'ModuleActionDto', description: string, icon: ActionIcons, increment?: number | null, isAllowed: boolean, key: string, max?: number | null, min?: number | null, name: string, type: ActionType, unit?: string | null }> } } | null> };

export type UpdateModuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateModuleMutation = { __typename?: 'Mutation', updateModuleRef: { __typename?: 'UpdateModuleRefPayload', moduleRefDto?: { __typename?: 'ModuleRefDto', id: any, name: string, description: string, key: string, type: ModuleType, group: ModuleGroup, isActuator: boolean, isSensor: boolean } | null } };

export type ExecuteActionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  actionKey: Scalars['String']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
}>;


export type ExecuteActionMutation = { __typename?: 'Mutation', executeModuleAction: { __typename?: 'ExecuteModuleActionPayload', boolean?: boolean | null } };

export type ListenStateChangeSubscriptionVariables = Exact<{
  key: Scalars['String']['input'];
  type: ModuleType;
}>;


export type ListenStateChangeSubscription = { __typename?: 'Subscription', onModuleStateChanged: { __typename?: 'ModuleStateDto', moduleKey: string, moduleType: ModuleType, connectionState: ConnectionState, lastUpdate: any, max?: number | null, min?: number | null, state?: string | null, stateType: StateType, unit?: string | null, value?: number | null, actions: Array<{ __typename?: 'ModuleActionDto', currentValue?: number | null, description: string, icon: ActionIcons, increment?: number | null, isAllowed: boolean, key: string, max?: number | null, min?: number | null, name: string, type: ActionType, unit?: string | null }> } };

export type GetPlantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlantsQuery = { __typename?: 'Query', plants: Array<{ __typename?: 'PlantDto', id: any, name: string, description: string, imageUrl: string, moduleConfigs: Array<{ __typename?: 'PlantModuleConfigDto', moduleType: ModuleType, rangeFrom: number, rangeTo: number }> }> };

export type GetPlantByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetPlantByIdQuery = { __typename?: 'Query', plant?: { __typename?: 'PlantDto', id: any, name: string, description: string, imageUrl: string, moduleConfigs: Array<{ __typename?: 'PlantModuleConfigDto', moduleType: ModuleType, rangeFrom: number, rangeTo: number }> } | null };

export type GetSensorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSensorsQuery = { __typename?: 'Query', sensors: Array<{ __typename?: 'SensorRefDto', id: any, name: string, description: string, key?: string | null, type: ModuleType }> };

export type GetSensorByIdQueryVariables = Exact<{
  id: Scalars['UUID']['input'];
}>;


export type GetSensorByIdQuery = { __typename?: 'Query', sensor?: { __typename?: 'SensorDto', id: any, key?: string | null, name: string, type: ModuleType, description: string, currentValue?: number | null, maxValue?: number | null, minValue?: number | null, unit?: string | null } | null };

export type UpdateSensorMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateSensorMutation = { __typename?: 'Mutation', updateSensorRef: { __typename?: 'UpdateSensorRefPayload', sensorRefDto?: { __typename?: 'SensorRefDto', key?: string | null, description: string, id: any, name: string, type: ModuleType } | null } };

export type ListenMeasurementSubscriptionVariables = Exact<{
  key: Scalars['String']['input'];
  type: ModuleType;
}>;


export type ListenMeasurementSubscription = { __typename?: 'Subscription', onSensorMeasurement: { __typename?: 'SensorDataDto', sensorKey: string, sensorType: ModuleType, connectionState: ConnectionState, currentValue?: number | null, min?: number | null, max?: number | null, unit?: string | null, lastUpdate: any } };


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
    actuatorRefDto {
      id
      name
      description
      key
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
export const ExecuteActuatorActionDocument = gql`
    mutation executeActuatorAction($id: ID!, $actionKey: String!, $value: Float) {
  executeActuatorAction(input: {id: $id, actionKey: $actionKey, value: $value}) {
    boolean
  }
}
    `;
export type ExecuteActuatorActionMutationFn = Apollo.MutationFunction<ExecuteActuatorActionMutation, ExecuteActuatorActionMutationVariables>;

/**
 * __useExecuteActuatorActionMutation__
 *
 * To run a mutation, you first call `useExecuteActuatorActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteActuatorActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeActuatorActionMutation, { data, loading, error }] = useExecuteActuatorActionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      actionKey: // value for 'actionKey'
 *      value: // value for 'value'
 *   },
 * });
 */
export function useExecuteActuatorActionMutation(baseOptions?: Apollo.MutationHookOptions<ExecuteActuatorActionMutation, ExecuteActuatorActionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExecuteActuatorActionMutation, ExecuteActuatorActionMutationVariables>(ExecuteActuatorActionDocument, options);
      }
export type ExecuteActuatorActionMutationHookResult = ReturnType<typeof useExecuteActuatorActionMutation>;
export type ExecuteActuatorActionMutationResult = Apollo.MutationResult<ExecuteActuatorActionMutation>;
export type ExecuteActuatorActionMutationOptions = Apollo.BaseMutationOptions<ExecuteActuatorActionMutation, ExecuteActuatorActionMutationVariables>;
export const ListenActuatorStateChangeDocument = gql`
    subscription listenActuatorStateChange($key: String!, $type: ModuleType!) {
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
 * __useListenActuatorStateChangeSubscription__
 *
 * To run a query within a React component, call `useListenActuatorStateChangeSubscription` and pass it any options that fit your needs.
 * When your component renders, `useListenActuatorStateChangeSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListenActuatorStateChangeSubscription({
 *   variables: {
 *      key: // value for 'key'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useListenActuatorStateChangeSubscription(baseOptions: Apollo.SubscriptionHookOptions<ListenActuatorStateChangeSubscription, ListenActuatorStateChangeSubscriptionVariables> & ({ variables: ListenActuatorStateChangeSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ListenActuatorStateChangeSubscription, ListenActuatorStateChangeSubscriptionVariables>(ListenActuatorStateChangeDocument, options);
      }
export type ListenActuatorStateChangeSubscriptionHookResult = ReturnType<typeof useListenActuatorStateChangeSubscription>;
export type ListenActuatorStateChangeSubscriptionResult = Apollo.SubscriptionResult<ListenActuatorStateChangeSubscription>;
export const GetAutomationConfigDocument = gql`
    query getAutomationConfig($id: UUID!) {
  automationConfig(bedId: $id) {
    parameters {
      key
      label
      fields {
        key
        label
        max
        min
        tsType
        unit
        valueType
        values {
          label
          value
        }
      }
    }
  }
}
    `;

/**
 * __useGetAutomationConfigQuery__
 *
 * To run a query within a React component, call `useGetAutomationConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationConfigQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAutomationConfigQuery(baseOptions: Apollo.QueryHookOptions<GetAutomationConfigQuery, GetAutomationConfigQueryVariables> & ({ variables: GetAutomationConfigQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAutomationConfigQuery, GetAutomationConfigQueryVariables>(GetAutomationConfigDocument, options);
      }
export function useGetAutomationConfigLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAutomationConfigQuery, GetAutomationConfigQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAutomationConfigQuery, GetAutomationConfigQueryVariables>(GetAutomationConfigDocument, options);
        }
export function useGetAutomationConfigSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAutomationConfigQuery, GetAutomationConfigQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAutomationConfigQuery, GetAutomationConfigQueryVariables>(GetAutomationConfigDocument, options);
        }
export type GetAutomationConfigQueryHookResult = ReturnType<typeof useGetAutomationConfigQuery>;
export type GetAutomationConfigLazyQueryHookResult = ReturnType<typeof useGetAutomationConfigLazyQuery>;
export type GetAutomationConfigSuspenseQueryHookResult = ReturnType<typeof useGetAutomationConfigSuspenseQuery>;
export type GetAutomationConfigQueryResult = Apollo.QueryResult<GetAutomationConfigQuery, GetAutomationConfigQueryVariables>;
export const GetRulesFromBedDocument = gql`
    query getRulesFromBed($bedId: UUID!) {
  rules(bedId: $bedId) {
    bedId
    expressionJson
    id
    isEnabled
    name
    actions {
      actionKey
      id
      moduleId
      moduleKey
      moduleType
      order
      ruleId
      value
    }
  }
}
    `;

/**
 * __useGetRulesFromBedQuery__
 *
 * To run a query within a React component, call `useGetRulesFromBedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRulesFromBedQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRulesFromBedQuery({
 *   variables: {
 *      bedId: // value for 'bedId'
 *   },
 * });
 */
export function useGetRulesFromBedQuery(baseOptions: Apollo.QueryHookOptions<GetRulesFromBedQuery, GetRulesFromBedQueryVariables> & ({ variables: GetRulesFromBedQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRulesFromBedQuery, GetRulesFromBedQueryVariables>(GetRulesFromBedDocument, options);
      }
export function useGetRulesFromBedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRulesFromBedQuery, GetRulesFromBedQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRulesFromBedQuery, GetRulesFromBedQueryVariables>(GetRulesFromBedDocument, options);
        }
export function useGetRulesFromBedSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRulesFromBedQuery, GetRulesFromBedQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRulesFromBedQuery, GetRulesFromBedQueryVariables>(GetRulesFromBedDocument, options);
        }
export type GetRulesFromBedQueryHookResult = ReturnType<typeof useGetRulesFromBedQuery>;
export type GetRulesFromBedLazyQueryHookResult = ReturnType<typeof useGetRulesFromBedLazyQuery>;
export type GetRulesFromBedSuspenseQueryHookResult = ReturnType<typeof useGetRulesFromBedSuspenseQuery>;
export type GetRulesFromBedQueryResult = Apollo.QueryResult<GetRulesFromBedQuery, GetRulesFromBedQueryVariables>;
export const GetRuleByIdDocument = gql`
    query getRuleById($ruleId: UUID!) {
  rule(ruleId: $ruleId) {
    bedId
    expressionJson
    id
    isEnabled
    name
    actions {
      actionKey
      id
      moduleId
      moduleKey
      moduleType
      order
      ruleId
      value
    }
  }
}
    `;

/**
 * __useGetRuleByIdQuery__
 *
 * To run a query within a React component, call `useGetRuleByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRuleByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRuleByIdQuery({
 *   variables: {
 *      ruleId: // value for 'ruleId'
 *   },
 * });
 */
export function useGetRuleByIdQuery(baseOptions: Apollo.QueryHookOptions<GetRuleByIdQuery, GetRuleByIdQueryVariables> & ({ variables: GetRuleByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRuleByIdQuery, GetRuleByIdQueryVariables>(GetRuleByIdDocument, options);
      }
export function useGetRuleByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRuleByIdQuery, GetRuleByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRuleByIdQuery, GetRuleByIdQueryVariables>(GetRuleByIdDocument, options);
        }
export function useGetRuleByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRuleByIdQuery, GetRuleByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRuleByIdQuery, GetRuleByIdQueryVariables>(GetRuleByIdDocument, options);
        }
export type GetRuleByIdQueryHookResult = ReturnType<typeof useGetRuleByIdQuery>;
export type GetRuleByIdLazyQueryHookResult = ReturnType<typeof useGetRuleByIdLazyQuery>;
export type GetRuleByIdSuspenseQueryHookResult = ReturnType<typeof useGetRuleByIdSuspenseQuery>;
export type GetRuleByIdQueryResult = Apollo.QueryResult<GetRuleByIdQuery, GetRuleByIdQueryVariables>;
export const SaveAutomationRuleDocument = gql`
    mutation saveAutomationRule($input: SaveAutomationRuleInput!) {
  saveAutomationRule(input: $input) {
    automationRuleDto {
      actions {
        ruleId
        moduleId
        moduleKey
        moduleType
        actionKey
        value
        order
        id
      }
      bedId
      expressionJson
      id
      isEnabled
      name
    }
  }
}
    `;
export type SaveAutomationRuleMutationFn = Apollo.MutationFunction<SaveAutomationRuleMutation, SaveAutomationRuleMutationVariables>;

/**
 * __useSaveAutomationRuleMutation__
 *
 * To run a mutation, you first call `useSaveAutomationRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveAutomationRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveAutomationRuleMutation, { data, loading, error }] = useSaveAutomationRuleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveAutomationRuleMutation(baseOptions?: Apollo.MutationHookOptions<SaveAutomationRuleMutation, SaveAutomationRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveAutomationRuleMutation, SaveAutomationRuleMutationVariables>(SaveAutomationRuleDocument, options);
      }
export type SaveAutomationRuleMutationHookResult = ReturnType<typeof useSaveAutomationRuleMutation>;
export type SaveAutomationRuleMutationResult = Apollo.MutationResult<SaveAutomationRuleMutation>;
export type SaveAutomationRuleMutationOptions = Apollo.BaseMutationOptions<SaveAutomationRuleMutation, SaveAutomationRuleMutationVariables>;
export const RemoveAutomationRuleDocument = gql`
    mutation removeAutomationRule($automationRuleId: UUID!) {
  removeAutomationRule(input: {automationRuleId: $automationRuleId}) {
    boolean
  }
}
    `;
export type RemoveAutomationRuleMutationFn = Apollo.MutationFunction<RemoveAutomationRuleMutation, RemoveAutomationRuleMutationVariables>;

/**
 * __useRemoveAutomationRuleMutation__
 *
 * To run a mutation, you first call `useRemoveAutomationRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveAutomationRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeAutomationRuleMutation, { data, loading, error }] = useRemoveAutomationRuleMutation({
 *   variables: {
 *      automationRuleId: // value for 'automationRuleId'
 *   },
 * });
 */
export function useRemoveAutomationRuleMutation(baseOptions?: Apollo.MutationHookOptions<RemoveAutomationRuleMutation, RemoveAutomationRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveAutomationRuleMutation, RemoveAutomationRuleMutationVariables>(RemoveAutomationRuleDocument, options);
      }
export type RemoveAutomationRuleMutationHookResult = ReturnType<typeof useRemoveAutomationRuleMutation>;
export type RemoveAutomationRuleMutationResult = Apollo.MutationResult<RemoveAutomationRuleMutation>;
export type RemoveAutomationRuleMutationOptions = Apollo.BaseMutationOptions<RemoveAutomationRuleMutation, RemoveAutomationRuleMutationVariables>;
export const GetBedByIdDocument = gql`
    query getBedById($id: UUID!) {
  bed(id: $id) {
    id
    name
    description
    plantId
    modules {
      id
      name
      description
      key
      type
      group
      isActuator
      isSensor
    }
    rules {
      id
      name
      expressionJson
      isEnabled
      actions {
        id
        ruleId
        moduleId
        moduleKey
        moduleType
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
export const AddModuleToBedDocument = gql`
    mutation addModuleToBed($bedId: ID!, $moduleId: ID!) {
  addModuleToBed(input: {bedId: $bedId, moduleId: $moduleId}) {
    moduleRefDto {
      id
    }
  }
}
    `;
export type AddModuleToBedMutationFn = Apollo.MutationFunction<AddModuleToBedMutation, AddModuleToBedMutationVariables>;

/**
 * __useAddModuleToBedMutation__
 *
 * To run a mutation, you first call `useAddModuleToBedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddModuleToBedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addModuleToBedMutation, { data, loading, error }] = useAddModuleToBedMutation({
 *   variables: {
 *      bedId: // value for 'bedId'
 *      moduleId: // value for 'moduleId'
 *   },
 * });
 */
export function useAddModuleToBedMutation(baseOptions?: Apollo.MutationHookOptions<AddModuleToBedMutation, AddModuleToBedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddModuleToBedMutation, AddModuleToBedMutationVariables>(AddModuleToBedDocument, options);
      }
export type AddModuleToBedMutationHookResult = ReturnType<typeof useAddModuleToBedMutation>;
export type AddModuleToBedMutationResult = Apollo.MutationResult<AddModuleToBedMutation>;
export type AddModuleToBedMutationOptions = Apollo.BaseMutationOptions<AddModuleToBedMutation, AddModuleToBedMutationVariables>;
export const RemoveModuleFromBedDocument = gql`
    mutation removeModuleFromBed($bedId: ID!, $moduleId: ID!) {
  removeModuleFromBed(input: {bedId: $bedId, moduleId: $moduleId}) {
    boolean
  }
}
    `;
export type RemoveModuleFromBedMutationFn = Apollo.MutationFunction<RemoveModuleFromBedMutation, RemoveModuleFromBedMutationVariables>;

/**
 * __useRemoveModuleFromBedMutation__
 *
 * To run a mutation, you first call `useRemoveModuleFromBedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveModuleFromBedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeModuleFromBedMutation, { data, loading, error }] = useRemoveModuleFromBedMutation({
 *   variables: {
 *      bedId: // value for 'bedId'
 *      moduleId: // value for 'moduleId'
 *   },
 * });
 */
export function useRemoveModuleFromBedMutation(baseOptions?: Apollo.MutationHookOptions<RemoveModuleFromBedMutation, RemoveModuleFromBedMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveModuleFromBedMutation, RemoveModuleFromBedMutationVariables>(RemoveModuleFromBedDocument, options);
      }
export type RemoveModuleFromBedMutationHookResult = ReturnType<typeof useRemoveModuleFromBedMutation>;
export type RemoveModuleFromBedMutationResult = Apollo.MutationResult<RemoveModuleFromBedMutation>;
export type RemoveModuleFromBedMutationOptions = Apollo.BaseMutationOptions<RemoveModuleFromBedMutation, RemoveModuleFromBedMutationVariables>;
export const GetModulesDocument = gql`
    query getModules($group: ModuleGroup!) {
  modules(group: $group) {
    id
    name
    description
    key
    type
    group
    isActuator
    isSensor
  }
}
    `;

/**
 * __useGetModulesQuery__
 *
 * To run a query within a React component, call `useGetModulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModulesQuery({
 *   variables: {
 *      group: // value for 'group'
 *   },
 * });
 */
export function useGetModulesQuery(baseOptions: Apollo.QueryHookOptions<GetModulesQuery, GetModulesQueryVariables> & ({ variables: GetModulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModulesQuery, GetModulesQueryVariables>(GetModulesDocument, options);
      }
export function useGetModulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModulesQuery, GetModulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModulesQuery, GetModulesQueryVariables>(GetModulesDocument, options);
        }
export function useGetModulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetModulesQuery, GetModulesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModulesQuery, GetModulesQueryVariables>(GetModulesDocument, options);
        }
export type GetModulesQueryHookResult = ReturnType<typeof useGetModulesQuery>;
export type GetModulesLazyQueryHookResult = ReturnType<typeof useGetModulesLazyQuery>;
export type GetModulesSuspenseQueryHookResult = ReturnType<typeof useGetModulesSuspenseQuery>;
export type GetModulesQueryResult = Apollo.QueryResult<GetModulesQuery, GetModulesQueryVariables>;
export const GetModuleByIdDocument = gql`
    query getModuleById($id: UUID!) {
  module(id: $id) {
    id
    key
    name
    description
    type
    group
    isActuator
    isSensor
    state {
      moduleKey
      moduleType
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
 * __useGetModuleByIdQuery__
 *
 * To run a query within a React component, call `useGetModuleByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModuleByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModuleByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetModuleByIdQuery(baseOptions: Apollo.QueryHookOptions<GetModuleByIdQuery, GetModuleByIdQueryVariables> & ({ variables: GetModuleByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModuleByIdQuery, GetModuleByIdQueryVariables>(GetModuleByIdDocument, options);
      }
export function useGetModuleByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModuleByIdQuery, GetModuleByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModuleByIdQuery, GetModuleByIdQueryVariables>(GetModuleByIdDocument, options);
        }
export function useGetModuleByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetModuleByIdQuery, GetModuleByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModuleByIdQuery, GetModuleByIdQueryVariables>(GetModuleByIdDocument, options);
        }
export type GetModuleByIdQueryHookResult = ReturnType<typeof useGetModuleByIdQuery>;
export type GetModuleByIdLazyQueryHookResult = ReturnType<typeof useGetModuleByIdLazyQuery>;
export type GetModuleByIdSuspenseQueryHookResult = ReturnType<typeof useGetModuleByIdSuspenseQuery>;
export type GetModuleByIdQueryResult = Apollo.QueryResult<GetModuleByIdQuery, GetModuleByIdQueryVariables>;
export const GetModulesInformationDocument = gql`
    query getModulesInformation {
  modulesInformation(where: {isActuator: {eq: true}}) {
    description
    group
    id
    isActuator
    key
    name
    type
    state {
      actions {
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
    isSensor
  }
}
    `;

/**
 * __useGetModulesInformationQuery__
 *
 * To run a query within a React component, call `useGetModulesInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetModulesInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetModulesInformationQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetModulesInformationQuery(baseOptions?: Apollo.QueryHookOptions<GetModulesInformationQuery, GetModulesInformationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetModulesInformationQuery, GetModulesInformationQueryVariables>(GetModulesInformationDocument, options);
      }
export function useGetModulesInformationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetModulesInformationQuery, GetModulesInformationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetModulesInformationQuery, GetModulesInformationQueryVariables>(GetModulesInformationDocument, options);
        }
export function useGetModulesInformationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetModulesInformationQuery, GetModulesInformationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetModulesInformationQuery, GetModulesInformationQueryVariables>(GetModulesInformationDocument, options);
        }
export type GetModulesInformationQueryHookResult = ReturnType<typeof useGetModulesInformationQuery>;
export type GetModulesInformationLazyQueryHookResult = ReturnType<typeof useGetModulesInformationLazyQuery>;
export type GetModulesInformationSuspenseQueryHookResult = ReturnType<typeof useGetModulesInformationSuspenseQuery>;
export type GetModulesInformationQueryResult = Apollo.QueryResult<GetModulesInformationQuery, GetModulesInformationQueryVariables>;
export const UpdateModuleDocument = gql`
    mutation updateModule($id: ID!, $name: String, $description: String) {
  updateModuleRef(input: {id: $id, name: $name, description: $description}) {
    moduleRefDto {
      id
      name
      description
      key
      type
      group
      isActuator
      isSensor
    }
  }
}
    `;
export type UpdateModuleMutationFn = Apollo.MutationFunction<UpdateModuleMutation, UpdateModuleMutationVariables>;

/**
 * __useUpdateModuleMutation__
 *
 * To run a mutation, you first call `useUpdateModuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateModuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateModuleMutation, { data, loading, error }] = useUpdateModuleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useUpdateModuleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateModuleMutation, UpdateModuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateModuleMutation, UpdateModuleMutationVariables>(UpdateModuleDocument, options);
      }
export type UpdateModuleMutationHookResult = ReturnType<typeof useUpdateModuleMutation>;
export type UpdateModuleMutationResult = Apollo.MutationResult<UpdateModuleMutation>;
export type UpdateModuleMutationOptions = Apollo.BaseMutationOptions<UpdateModuleMutation, UpdateModuleMutationVariables>;
export const ExecuteActionDocument = gql`
    mutation executeAction($id: ID!, $actionKey: String!, $value: Float) {
  executeModuleAction(input: {id: $id, actionKey: $actionKey, value: $value}) {
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
    subscription listenStateChange($key: String!, $type: ModuleType!) {
  onModuleStateChanged(key: $key, type: $type) {
    moduleKey
    moduleType
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
export const GetPlantsDocument = gql`
    query getPlants {
  plants {
    id
    name
    description
    imageUrl
    moduleConfigs {
      moduleType
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
    moduleConfigs {
      moduleType
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
    sensorRefDto {
      key
      description
      id
      name
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
    subscription listenMeasurement($key: String!, $type: ModuleType!) {
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