import { ModuleRefDto } from "../../__generated__/graphql";
import { getTypeIconCircle } from "./utils";

export type ModuleListProps = {
  modules: ModuleRefDto[];
  disabledModules?: ModuleRefDto[];
  onSelectModule?: (Module: ModuleRefDto) => void;
};

export default function ModuleList({ modules, disabledModules = [], onSelectModule = () => {} }: ModuleListProps) {
  return (
    <div className="flex flex-col gap-4">
      {modules.map((module) => (
        <button
          key={module.id}
          className="flex cursor-pointer flex-col gap-2 rounded-lg border p-2 text-left hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-200 phone:p-4"
          disabled={disabledModules.some((s) => s.id === module.id)}
          onClick={() => onSelectModule(module)}
        >
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="flex flex-row items-center gap-3 text-xl font-bold">
              <div>{getTypeIconCircle(module.type)}</div>
              <span className="line-clamp-1">{module.name}</span>
            </span>
            <span className="self-center text-right text-sm text-gray-400">{module.type}</span>
          </div>

          <span className="col-span-2 text-gray-500">{module.description}</span>

          <div className="grid grid-cols-[1fr_auto] gap-4">
            <span className="text-xs text-red-500">
              {disabledModules.some((s) => s.id === module.id) ? "already connected" : null}
            </span>
            <span className="flex flex-row gap-2 self-center justify-self-end text-xs">
              <span className="text-gray-400">Device:</span>
              <span className="text-gray-500">{module.key}</span>
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
