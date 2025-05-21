/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { AutomationConfigDto, BedDto } from "../__generated__/graphql";
import { RuleElement } from "../models/automation";
import { useBedContext } from "./useCurrentBed";

export type AutomationValue = {
  bed: BedDto;
  config: AutomationConfigDto | null;
  rules: RuleElement[];
  fieldSelection: any;
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
  const [ruleExpressions, setRuleExpressions] = useState<RuleElement[]>([]);
  const [fielSelection, setFieldSelection] = useState<any>(null);

  const { data: config } = useQuery<AutomationConfigDto>({
    queryKey: ["automation", bed.id],
    refetchOnMount: true,
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/beds/${bed.id}/automation/config`);
      if (!response.ok) {
        throw new Error("Failed to fetch automation");
      }
      return response.json();
    },
    enabled: !!bed,
  });

  useEffect(() => {
    setRuleExpressions(
      rules.map((rule) => {
        return JSON.parse(rule.expressionJson);
      }),
    );
  }, [rules]);

  useEffect(() => {
    setFieldSelection(
      config?.fields.reduce((acc, item) => {
        const { connectorKey, type } = item;
        if (!acc[connectorKey]) {
          acc[connectorKey] = [];
        }
        acc[connectorKey].push(type);
        return acc;
      }, {} as any),
    );
  }, [config]);

  return {
    bed,
    rules: ruleExpressions,
    config: config ?? ({} as AutomationConfigDto),
    fieldSelection: fielSelection,
  };
}
