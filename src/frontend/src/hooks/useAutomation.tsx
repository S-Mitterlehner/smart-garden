/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useMemo } from "react";
import { AutomationConfigDto, AutomationRuleDto, BedDto, ParameterFieldDto, useAddAutomationRuleToBedMutation, useGetAutomationConfigQuery, useUpdateAutomationRuleFromBedMutation } from "../__generated__/graphql";
import { useBedContext } from "./useCurrentBed";
import { notifications } from "@mantine/notifications";

export type FieldSelectionGroup = {
  group: string;
  items: { value: string; label: string }[];
};

export type AutomationValue = {
  bed: BedDto;
  config: AutomationConfigDto | null;
  rules: AutomationRuleDto[];
  fieldSelection: any;
  parameterFields: ParameterFieldDto[];

  addRule: (name: string, expression: any, enabled: boolean) => void;
  updateRule: (id: string, name: string, expression: any, enabled: boolean) => void;
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
  const { bed, rules, refetch } = useBedContext();
  
  const [addAutomationRuleMutation] = useAddAutomationRuleToBedMutation();
  const [updateAutomationRuleMutation] = useUpdateAutomationRuleFromBedMutation();

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

  const rulesParsed: AutomationRuleDto[] = useMemo(
    () =>
      rules.map((rule) => ({
        ...rule,
        expressionJson: JSON.parse(rule.expressionJson),
      })),
    [rules]
  );

  const parameterFields = useMemo(() => config?.parameters.flatMap((p) => p.fields) ?? [], [config]);


  const addRule = (name: string, expression: any, enabled: boolean) => {
    addAutomationRuleMutation({
      variables: {
        bedId: bed.id,
        expressionJson: JSON.stringify(expression),
        name: name ?? "",
        isEnabled: enabled
      }
    })
    .then((r) => {
      refetch();
      console.log(r);
      notifications.show({
        title: `${name} added`,
        message: `Automation ${name} added to bed`,
        color: "green",
      });
    })
    .catch((err) => {
      console.error(err);
      notifications.show({
        title: "Error",
        message: `Failed to add automation rule ${name} to bed with id ${bed.id}`,
        color: "red"
      })
    });
  };

  const updateRule = (id: string, name: string, expression: any, enabled: boolean) => {
    updateAutomationRuleMutation({
      variables: {
        bedId: bed.id,
        expressionJson: JSON.stringify(expression),
        id: id,
        name: name ?? "",
        isEnabled: enabled
      }
    })
    .then((r) => {
      refetch();
      console.log(r);
      notifications.show({
        title: `${name} updated`,
        message: `Automation ${name} updated`,
        color: "green",
      });
    })
    .catch((err) => {
      console.error(err);
      notifications.show({
        title: "Error",
        message: `Failed to update automation rule ${name} from bed with id ${bed.id}`,
        color: "red"
      })
    });
  };

  return {
    bed,
    addRule: addRule,
    updateRule: updateRule,
    rules: rulesParsed,
    config: config ?? ({} as AutomationConfigDto),
    fieldSelection: fieldSelection,
    parameterFields: parameterFields,
  };
}
