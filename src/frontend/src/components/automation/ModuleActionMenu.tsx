import { Menu, Button } from '@mantine/core';
import { AutomationRuleActionDto, ModuleDto } from '../../__generated__/graphql';
import { IconPlus } from '@tabler/icons-react';
import { getActionIcon, getTypeIconCircle } from '../sensors/utils';
import { useAutomationContext } from '../../hooks/useAutomation';

export function ModuleActionMenu({ modules, ruleId, actionsInUse }
  : { modules: ModuleDto[], ruleId: string, actionsInUse: AutomationRuleActionDto[] }) {

  const { addRuleAction } = useAutomationContext();

  return (
    <Menu shadow="md" width={200} position="bottom-start">
      <Menu.Target>
        <Button className="min-w-min " variant="subtle"><IconPlus />Add Action</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{modules.at(0)?.key}</Menu.Label>
        {modules.map((mod) => (
          <Menu.Sub key={mod.id}>
            <Menu.Sub.Target>
              <Menu.Sub.Item leftSection={getTypeIconCircle(mod.type)}>{mod.name}</Menu.Sub.Item>
            </Menu.Sub.Target>

            <Menu.Sub.Dropdown>
              {mod.state.actions.map((action) => (
                (actionsInUse.find((a) => (a.actionKey == action.key)) == null) ?
                <Menu.Item
                  key={action.key}
                  onClick={() => addRuleAction(action.key, ruleId, mod.id, undefined)}
                  leftSection={getActionIcon(action.icon)}
                >
                  {action.name}
                </Menu.Item>: null
              ))}
            </Menu.Sub.Dropdown>
          </Menu.Sub>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
