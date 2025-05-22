using SmartGarden.Modules;
using SmartGarden.Modules.Models;

namespace SmartGarden.ExecutorService;

public class NoOpModuleListener : IModuleListener
{
    public Task PublishStateChangeAsync(ModuleState data, IEnumerable<Modules.Models.ActionDefinition> actions) => Task.CompletedTask;
}