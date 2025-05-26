using SmartGarden.Modules.Models;

namespace SmartGarden.Modules;

public class NoOpModuleListener : IModuleListener
{
    public Task PublishStateChangeAsync(ModuleState data, IEnumerable<Modules.Models.ActionDefinition> actions) => Task.CompletedTask;
}