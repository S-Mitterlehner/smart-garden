using SmartGarden.Core.Enums;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework.Seeder;

public class DevSeeder(ApplicationContext context) : BaseSeeder(context)
{
    protected override async Task Initialize()
    {
        var psc1 = await CreateOrUpdateAsync(new PlantSensorConfig
        {
            Id = new Guid("1b9c649b-55e1-422b-b86c-876c72fd2ea1"),
            RangeFrom = 15,
            RangeTo = 25,
            SensorType = SensorType.Temperature
        });
        
        var psc2 = await CreateOrUpdateAsync(new PlantSensorConfig
        {
            Id = new Guid("13be42e3-d80c-4566-9b1c-8fce80fe8c38"),
            RangeFrom = 40,
            RangeTo = 50,
            SensorType = SensorType.Humidity
        });

        var p = await CreateOrUpdateAsync(new Plant
        {
            Id = new Guid("05c7919a-1225-4ee3-b5ea-ac720f1af14b")
            , Name = "Tomato"
            , Description = "Tomato is a fruit that is often used as a vegetable in cooking. It is rich in vitamins and antioxidants."
            , ImageUrl = "/plants/tomato.svg"
            , SensorConfigs = [psc1, psc2]
        });

        await CreateOrUpdateAsync(new Plant
        {
            Id = new Guid("a1608fb0-0b18-4532-b5db-09b00f7975d8")
            , Name = "Carrot"
            , Description = "Carrot is a root vegetable that is often orange in color. It is rich in beta-carotene and other vitamins."
            , ImageUrl = "/plants/carrot.svg"
        });

        await CreateOrUpdateAsync(new Plant
        {
            Id = new Guid("ac500680-88ae-4edc-8cc9-85d1eacb4f3c")
            , Name = "Potato"
            , Description = "Potato is a starchy tuber that is often used as a vegetable in cooking. It is rich in carbohydrates and vitamins."
            , ImageUrl = "/plants/potato.svg"
        });

        var c = await CreateOrUpdateAsync(new ActuatorRef
        {
            Id = new Guid("f3948dbb-4c99-4173-86d6-3e24834639df"),
            Name = "Water Pump",
            Type = ActuatorType.Pump,
            Order = 1,
            ConnectorKey = "waterpump"
        });
        
        var c2 = await CreateOrUpdateAsync(new ActuatorRef
        {
            Id = new Guid("6060f089-42a3-4e7d-9ef6-2557866023a4"),
            Name = "Hatch",
            Type = ActuatorType.Hatch,
            Order = 2,
            ConnectorKey = "hatch"
        });

        var s1 = await CreateOrUpdateAsync(new SensorRef
        {
            Id = new Guid("52ff96f1-71f4-433f-829c-db07394e1aba")
            , Name = "Temperature"
            , Description = "Temperature sensor is a device that measures the temperature of the environment. It is often used in weather stations."
            , Type = SensorType.Temperature
            , ConnectorKey = "sm-48ca435508f0"
            , Topic = "smart-garden/sm-48ca435508f0/temperature"
            , Order = 1
        });

        var s2 = await CreateOrUpdateAsync(new SensorRef
        {
            Id = new Guid("28525480-9434-4318-82f7-3d89cb231166")
            , Name = "Humidity"
            , Description = "Humidity sensor is a device that measures the humidity of the environment. It is often used in weather stations."
            , Type = SensorType.Humidity
            , ConnectorKey = "sm-48ca435508f0"
            , Topic = "smart-garden/sm-48ca435508f0/humidity"
            , Order = 2
        });

        await context.SaveChangesAsync();

        var bed = new Bed
        {
            Id = new Guid("a3c51a2a-0b07-442f-af31-3b7d88dda10d")
            , Name = "Test Bed"
            , Description = "Test Bed"
            , PlantId = p.Id
        };

        bed.Actuators.AddRange(c, c2);
        bed.Sensors.AddRange(s1, s2);
        await CreateOrUpdateAsync(bed);

        await context.SaveChangesAsync();
    }
}