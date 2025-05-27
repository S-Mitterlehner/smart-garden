/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useMemo } from "react";
import { AutomationConfigDto, BedDto, ParameterFieldDto, useGetAutomationConfigQuery } from "../__generated__/graphql";
import { Rule } from "../models/automation";
import { useBedContext } from "./useCurrentBed";

export type FieldSelectionGroup = {
  group: string;
  items: { value: string; label: string }[];
};

export type AutomationValue = {
  bed: BedDto;
  config: AutomationConfigDto | null;
  rules: Rule[];
  fieldSelection: any;
  parameterFields: ParameterFieldDto[];
};

const AutomationContext = createContext<AutomationValue | null>(null);

export function AutomationProvider({ children }: { children: React.ReactNode }) {
  const automation = useAutomation();

  return <AutomationContext.Provider value={automation}>{children}</AutomationContext.Provider>;
}

export function useAutomationContext(): AutomationValue {
  const context = useContext(AutomationContext);
  if (!context) {
    throw new Error("useAutomation must be used within a AutomationProvider");
  }
  return context;
}

export function useAutomation(): AutomationValue {
  const { bed, rules } = useBedContext();

  const { data: { automationConfig: config } = {} } = useGetAutomationConfigQuery({
    variables: { id: bed.id },
  });

  const fieldSelection = useMemo(
    () =>
      config?.parameters.map((p) => ({
        group: p.label,
        items: p.fields.map((f) => ({ value: f.key, label: f.label })),
      })),
    [config],
  );

  const ruleExpressions = useMemo(
    () =>
      rules.map((rule) => {
        return JSON.parse(rule.expressionJson);
      }),
    [rules],
  );

  const parameterFields = useMemo(() => config?.parameters.flatMap((p) => p.fields) ?? [], [config]);

  return {
    bed,
    rules: ruleExpressions,
    config: config ?? ({} as AutomationConfigDto),
    fieldSelection: fieldSelection,
    parameterFields: parameterFields,
  };
}
