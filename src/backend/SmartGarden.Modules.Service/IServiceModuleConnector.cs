using SmartGarden.Modules.Models;

namespace SmartGarden.Modules.Service;

public interface IServiceModuleConnector : IModuleConnector
{
    string Topic { get; }
    Task InitializeAsync();
    Task ExecuteAsync(ActionExecution execution);
}