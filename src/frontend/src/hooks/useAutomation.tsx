/* eslint-disable @typescript-eslint/no-explicit-any */
import { notifications } from "@mantine/notifications";
import { createContext, useContext, useMemo } from "react";
import {
  AutomationConfigDto,
  AutomationRuleActionDto,
  AutomationRuleDto,
  BedDto,
  ModuleDto,
  ParameterFieldDto,
  useAddAutomationRuleActionToModuleMutation,
  useAddAutomationRuleToBedMutation,
  useGetAutomationConfigQuery,
  useGetModulesInformationQuery,
  useGetRulesFromBedQuery,
  useRemoveAutomationRuleActionMutation,
  useRemoveAutomationRuleMutation,
  useUpdateAutomationRuleActionFromModuleMutation,
  useUpdateAutomationRuleFromBedMutation,
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

  addRule: (name: string, expression: any, enabled: boolean) => void;
  updateRule: (id: string, name: string, expression: any, enabled: boolean) => void;
  deleteRule: (rule: AutomationRuleDto) => void;

  addRuleAction: (actionKey: string, ruleId: string, moduleId: string, value: number | undefined) => void;
  updateRuleAction: (action: AutomationRuleActionDto) => void;
  deleteRuleAction: (action: AutomationRuleActionDto) => void;
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

  const [addAutomationRuleMutation] = useAddAutomationRuleToBedMutation();
  const [updateAutomationRuleMutation] = useUpdateAutomationRuleFromBedMutation();
  const [removeAutomationRuleMutation] = useRemoveAutomationRuleMutation();

  const [addAutomationRuleActionMutation] = useAddAutomationRuleActionToModuleMutation();
  const [updateAutomationRuleActionMutation] = useUpdateAutomationRuleActionFromModuleMutation();
  const [removeAutomationRuleActionMutation] = useRemoveAutomationRuleActionMutation();

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

  const addRule = (name: string, expression: any, enabled: boolean) => {
    addAutomationRuleMutation({
      variables: {
        bedId: bed.id,
        expressionJson: JSON.stringify(expression),
        name: name ?? "",
        isEnabled: enabled,
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

  const updateRule = (id: string, name: string, expression: any, enabled: boolean) => {
    updateAutomationRuleMutation({
      variables: {
        bedId: bed.id,
        expressionJson: JSON.stringify(expression),
        id: id,
        name: name ?? "",
        isEnabled: enabled,
      },
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

  const addRuleAction = (actionKey: string, ruleId: string, moduleId: string, value: number | undefined) => {

    console.log(actionKey, ruleId, moduleId, value);
    
    addAutomationRuleActionMutation({
      variables: { actionKey: actionKey, automationRuleId: ruleId, moduleId: moduleId, value: value }
    })
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to add action with id ${actionKey}`,
          color: "red",
        });
      });
  }

  const updateRuleAction = (action: AutomationRuleActionDto) => {
    updateAutomationRuleActionMutation({
      variables: { id: action.id, actionKey: action.actionKey, ruleId: action.ruleId, moduleId: action.moduleId, value: action.value }
    })
      .then(() => {
        refetch();
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to update action with id ${action.id}`,
          color: "red",
        });
      });
  }

  const deleteRuleAction = (action: AutomationRuleActionDto) => {
    removeAutomationRuleActionMutation({
      variables: { actionId: action.id },
    })
      .then(() => {
        refetch();
        notifications.show({
          title: `Action deleted`,
          message: `Action ${action.actionKey} deleted`,
          color: "yellow",
        });
      })
      .catch((err) => {
        console.error(err);
        notifications.show({
          title: "Error",
          message: `Failed to delete action with id ${action.id}`,
          color: "red",
        });
      });
  };

  return {
    bed,
    addRule: addRule,
    updateRule: updateRule,
    deleteRule: deleteRule,
    addRuleAction: addRuleAction,
    updateRuleAction: updateRuleAction,
    deleteRuleAction: deleteRuleAction,
    modules: modules,
    rules: automationRules,
    config: config ?? ({} as AutomationConfigDto),
    fieldSelection: fieldSelection,
    parameterFields: parameterFields,
  };
}
