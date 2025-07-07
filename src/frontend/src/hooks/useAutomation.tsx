/* eslint-disable @typescript-eslint/no-explicit-any */
import { notifications } from "@mantine/notifications";
import { createContext, useContext, useMemo } from "react";
import {
  AutomationConfigDto,
  AutomationRuleDto,
  BedDto,
  ModuleDto,
  ParameterFieldDto,
  useGetAutomationConfigQuery,
  useGetModulesInformationQuery,
  useGetRulesFromBedQuery,
  useRemoveAutomationRuleMutation,
  useSaveAutomationRuleMutation,
} from "../__generated__/graphql";
import { useBedContext } from "./useCurrentBed";

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
  modules: ModuleDto[];

  saveRule: (rule: AutomationRuleDto) => void;
  deleteRule: (rule: AutomationRuleDto) => void;
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
  const { bed } = useBedContext();

  const { data: { rules } = {}, refetch } = useGetRulesFromBedQuery({
    variables: { bedId: bed.id },
    skip: !bed.id,
  });

  const [saveAutomationRule] = useSaveAutomationRuleMutation();
  const [removeAutomationRuleMutation] = useRemoveAutomationRuleMutation();

  const { data } = useGetModulesInformationQuery({});
  //const modules: ModuleDto[] = data?.modulesInformation ?? [];
  const modules = (data?.modulesInformation ?? []).filter((m): m is ModuleDto => m !== null);

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

  const automationRules: AutomationRuleDto[] = useMemo(
    () =>
      (rules ?? []).map((rule) => ({
        ...rule,
        expressionJson: JSON.parse(rule.expressionJson),
      })),
    [rules],
  );

  const parameterFields = useMemo(() => config?.parameters.flatMap((p) => p.fields) ?? [], [config]);

  const saveRule = (rule: AutomationRuleDto) => {
    saveAutomationRule({
      variables: {
        input: {
          dto: rule,
        },
      },
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
          color: "red",
        });
      });
  };

  const deleteRule = (rule: AutomationRuleDto) => {
    removeAutomationRuleMutation({
      variables: { automationRuleId: rule.id },
    })
      .then(() => {
        refetch();
        notifications.show({
          title: `Rule deleted`,
          message: `Automation rule ${rule.name} deleted`,
          color: "yellow",
        });
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to delete automation rule with id ${rule.id}`,
          color: "red",
        });
      });
  };

  return {
    bed,
    saveRule: saveRule,
    deleteRule: deleteRule,
    modules: modules,
    rules: automationRules,
    config: config ?? ({} as AutomationConfigDto),
    fieldSelection: fieldSelection,
    parameterFields: parameterFields,
  };
}
