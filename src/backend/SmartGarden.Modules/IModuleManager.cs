using SmartGarden.EntityFramework.Models;

namespace SmartGarden.Modules;

public interface IModuleManager
{
    Task SetupRegisterListenerAsync();
}