import { ActionIcon, Drawer } from "@mantine/core";
import { IconBinoculars, IconEngine, IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { ModuleGroup, ModuleRefDto, ModuleType, PlantModuleConfigDto } from "../../__generated__/graphql";
import ModuleCard from "../../components/modules/ModuleCard";
import ModuleList from "../../components/modules/ModuleList";
import SectionTitle from "../../components/SectionTitle";
import { useBedContext } from "../../hooks/useCurrentBed";
import { ModuleProvider } from "../../hooks/useModule";
import useModules from "../../hooks/useModules";

export type ModuleSectionProps = {
  group: ModuleGroup;
};

export default function ModuleSection({ group }: ModuleSectionProps) {
  const { addModule, removeModule, getModulesByGroup, currentPlant } = useBedContext();
  const modules = useMemo(() => getModulesByGroup(group), [getModulesByGroup, group]);
  const { modules: availableModules } = useModules(group);
  const [showModuleDrawer, setShowModuleDrawer] = useState(false);
  const handleModuleAction = (module: ModuleRefDto, action: string) => {
    switch (action) {
      case "remove":
        removeModule(module);
        break;
    }
  };

  const getPlantConfig = (moduleType: ModuleType) => {
    const defaultConfig: PlantModuleConfigDto = {
      moduleType: moduleType,
      rangeFrom: -1,
      rangeTo: -1,
    };

    const sensorConfig = currentPlant?.value?.moduleConfigs?.find((config) => config.moduleType === moduleType);

    if (!sensorConfig) return defaultConfig;
    return sensorConfig;
  };

  const handleModuleAdd = (module: ModuleRefDto) => {
    addModule(module);
    setShowModuleDrawer(false);
  };
  const moduleActionComponent = (
    <ActionIcon
      variant="subtle"
      size="xl"
      color="oklch(76.5% 0.177 163.223)"
      onClick={() => setShowModuleDrawer(!showModuleDrawer)}
    >
      <IconPlus className="h-6 w-6" />
    </ActionIcon>
  );

  return (
    <>
      <Drawer
        opened={showModuleDrawer}
        position="right"
        offset={15}
        radius={10}
        onClose={() => setShowModuleDrawer(false)}
        title="Add Module"
      >
        <ModuleList modules={availableModules} disabledModules={modules} onSelectModule={handleModuleAdd} />
      </Drawer>

      <div>
        <SectionTitle
          title={group === ModuleGroup.Actuator ? "Actuators" : "Sensors"}
          actionComponent={moduleActionComponent}
          description="Click on an module to see actions and options."
          icon={
            group === ModuleGroup.Actuator ? (
              <IconEngine className="h-8 w-8 text-emerald-400" />
            ) : (
              <IconBinoculars className="h-8 w-8 text-emerald-400" />
            )
          }
        ></SectionTitle>

        <div className="flex flex-row flex-wrap gap-4">
          {modules.map((module) => (
            <ModuleProvider key={module.id} moduleId={module.id}>
              <ModuleCard plantConfig={getPlantConfig(module.type)} onMenuAction={handleModuleAction} />
            </ModuleProvider>
          ))}
          <button
            onClick={() => setShowModuleDrawer(true)}
            className="relative flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-4 border-dashed border-gray-300 p-4 hover:bg-gray-200 phone:w-64"
          >
            <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4">
              <IconPlus className="h-12 w-12 text-gray-400" />
              <span className="text-sm text-gray-400">Add Module</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
