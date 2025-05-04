export type AutomationConfig = {
  fields: ParameterField[];
};

export type ParameterField = {
  connectorKey: string;
  type: string;
  tsType: string;
  min?: number;
  max?: number;
  unit?: string;
  values?: ParameterSelectValues[];
};

export type ParameterSelectValues = {
  label: string;
  value: string;
};

export type AutomationRule = {
  bedId: string;
  name: string;
  expression: string;
  actions: AutomationRuleAction[];
};

export type AutomationRuleAction = {
  ruleId: string;
  actuatorId: string;
  actuatorKey: string;
  actuatorType: string;
  actionKey: string;
  value: number | null;
  order: number;
};
