using SmartGarden.ConnectorService.EntityFramework.Models;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Core.Seeder;
using SmartGarden.Modules.Enums;

namespace SmartGarden.ConnectorService.EntityFramework.Seeder;

public class DevSeeder(ConnectionServiceDbContext context) : BaseSeeder(context)
{
    protected override async Task Initialize()
    {
        await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("f3948dbb-4c99-4173-86d6-3e24834639df"),
            Type = ModuleType.Pump,
            ModuleKey = "sg-48ca435508f0",
            IsDeleted = false,
            Topic = "smart-garden/sg-48ca435508f0/waterpump"
        });

        await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("6060f089-42a3-4e7d-9ef6-2557866023a4"),
            Type = ModuleType.Hatch,
            ModuleKey = "sg-48ca435508f0",
            IsDeleted = false,
            Topic = "smart-garden/sg-48ca435508f0/hatch"
        });
        
        await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("52ff96f1-71f4-433f-829c-db07394e1aba")
            , Type = ModuleType.Temperature
            , ModuleKey = "sg-48ca435508f0"
            , IsDeleted = false
            , Topic = "smart-garden/sg-48ca435508f0/temperature"
        });

        await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("28525480-9434-4318-82f7-3d89cb231166")
            , Type = ModuleType.Humidity
            , ModuleKey = "sg-48ca435508f0"
            , IsDeleted = false
            , Topic = "smart-garden/sg-48ca435508f0/humidity"
        });
        
        await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("bea18347-3611-4cd7-a257-c9518c85cad7")
            , Type = ModuleType.Moisture
            , ModuleKey = "sg-48ca435508f0"
            , IsDeleted = false
            , Topic = "smart-garden/sg-48ca435508f0/moisture"
        });
        
        await context.SaveChangesAsync();
    }
}