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
            RangeFrom = 15,
            RangeTo = 25,
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

        //var c1A1 = await CreateOrUpdateAsync(new ActuatorAction
        //{
        //    Id = new Guid("7645d82c-a1e0-4ee5-bccb-147567f3bcc5")
        //    , Key = "pump.start"
        //    , Name = "Start"
        //    , Description = "Starts the water pump"
        //    , Icon = ActionIcons.Play
        //    , Order = 1
        //});
        //var c1A2 = await CreateOrUpdateAsync(new ActuatorAction
        //{
        //    Id = new Guid("1f6ab070-be54-41ac-b6e8-1ee29df456a4")
        //    , Key = "pump.stop"
        //    , Name = "Stop"
        //    , Description = "Stops the water pump"
        //    , Icon = ActionIcons.Stop
        //    , Order = 2
        //});

        var c = await CreateOrUpdateAsync(new ActuatorRef
        {
            Id = new Guid("f3948dbb-4c99-4173-86d6-3e24834639df"),
            Name = "Water Pump",
            //Description = "Water pump is a device that moves water from one place to another. It is often used in irrigation systems.",
            //Actions = [c1A1, c1A2]
        });

        var s1 = await CreateOrUpdateAsync(new SensorRef
        {
            Id = new Guid("52ff96f1-71f4-433f-829c-db07394e1aba")
            , Name = "Temperature"
            , Description = "Temperature sensor is a device that measures the temperature of the environment. It is often used in weather stations."
            , Min = 0
            , Max = 100
            , Unit = "°C"
            , Type = SensorType.Temperature
            , Order = 1
        });

        var s2 = await CreateOrUpdateAsync(new SensorRef
        {
            Id = new Guid("28525480-9434-4318-82f7-3d89cb231166")
            , Name = "Humidity"
            , Description = "Humidity sensor is a device that measures the humidity of the environment. It is often used in weather stations."
            , Min = 0
            , Max = 100
            , Unit = "%"
            , Type = SensorType.Humidity
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

        bed.Actuators.AddRange(c);
        bed.Sensors.AddRange(s1, s2);
        await CreateOrUpdateAsync(bed);

        await context.SaveChangesAsync();
    }
}