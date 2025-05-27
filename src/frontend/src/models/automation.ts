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
  id: string;
  bedId: string;
  name: string;
  expressionJson: string;
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

export type Rule = RuleConnector | RuleElement;

export type RuleConnector = {
  [key: string]: RuleElement[];
};

export type RuleElement = {
  [key: string]: [RuleValueRef, string | number | boolean];
};

export type RuleValueRef = {
  var: string;
};
