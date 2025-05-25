using SmartGarden.AutomationService.EntityFramework.Models;
using SmartGarden.EntityFramework.Core.Seeder;
using SmartGarden.Modules.Enums;

namespace SmartGarden.AutomationService.EntityFramework.Seeder;

public class DevSeeder(AutomationServiceDbContext context) : BaseSeeder(context)
{
    protected override async Task Initialize()
    {
        var c = await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("f3948dbb-4c99-4173-86d6-3e24834639df"),
            Type = ModuleType.Pump,
            ModuleKey = "sg-48ca435508f0"
        });

        var c2 = await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("6060f089-42a3-4e7d-9ef6-2557866023a4"),
            Type = ModuleType.Hatch,
            ModuleKey = "sg-48ca435508f0"
        });

        var s1 = await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("52ff96f1-71f4-433f-829c-db07394e1aba")
            , Type = ModuleType.Temperature
            , ModuleKey = "sg-48ca435508f0"
        });

        var s2 = await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("28525480-9434-4318-82f7-3d89cb231166")
            , Type = ModuleType.Humidity
            , ModuleKey = "sg-48ca435508f0"
        });
        
        
        var s3 = await CreateOrUpdateAsync(new ModuleRef
        {
            Id = new Guid("bea18347-3611-4cd7-a257-c9518c85cad7")
            , Type = ModuleType.Moisture
            , ModuleKey = "sg-48ca435508f0"
        });

        await context.SaveChangesAsync();

        
        await CreateOrUpdateAsync(new AutomationRule
        {
            Id = new Guid("f2b0c4a1-3d8e-4b5e-8f6c-7a2d9f1c3b5e"),
            Name = "Watering",
            ExpressionJson = $$"""
                              {
                                 "<": [
                                    { "var": "{{s1.ModuleKey.Replace("-", "_")}}.Temperature" },
                                    30
                                 ]
                              }
                              """,
            IsEnabled = true,
            CoolDown = new TimeSpan(0, 5, 0) /*5 min*/,
            Actions =
            [
                new AutomationRuleAction
                {
                    ModuleId = c.Id,
                    ActionKey = "pump.run",
                    Value = 10
                }
            ]
        });

        await CreateOrUpdateAsync(new AutomationRule
        {
            Id = new Guid("2d954786-1209-41d3-82ae-bd3618c3d038"),
            Name = "Watering 2",
            ExpressionJson = $$"""
                              {
                                "and": [
                                    { ">": [{ "var": "CurrentTime" }, "19:00:00"] },
                                    { "<": [{ "var": "CurrentTime" }, "23:30:00"] }
                                ]
                              }
                              """,
            IsEnabled = false,
            CoolDown = new TimeSpan(0, 5, 0) /*5 min*/,
            Actions =
            [
                new AutomationRuleAction
                {
                    ModuleId = c.Id,
                    ActionKey = "pump.run",
                    Value = 10
                }
            ]
        });

        await context.SaveChangesAsync();
    }
}