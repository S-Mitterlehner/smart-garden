using SmartGarden.Modules.Models;

namespace SmartGarden.Modules;

public interface IModuleListener
{
    public Task PublishStateChangeAsync(ModuleState data, IEnumerable<ActionDefinition> actions);
}