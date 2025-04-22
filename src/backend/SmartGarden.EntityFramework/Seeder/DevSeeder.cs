using SmartGarden.EntityFramework.Enums;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework.Seeder;

public class DevSeeder(ApplicationContext context) : BaseSeeder(context)
{
    protected override async Task Initialize()
    {
        var p = new Plant
        {
            Id = new Guid("05c7919a-1225-4ee3-b5ea-ac720f1af14b")
            , Name = "Tomato"
            , Description = "Tomato is a fruit that is often used as a vegetable in cooking. It is rich in vitamins and antioxidants."
            , ImageUrl = "/plants/tomato.svg"
        };
        await CreateAsync(p);

        await CreateAsync(new Plant
        {
            Id = new Guid("a1608fb0-0b18-4532-b5db-09b00f7975d8")
            , Name = "Carrot"
            , Description = "Carrot is a root vegetable that is often orange in color. It is rich in beta-carotene and other vitamins."
            , ImageUrl = "/plants/carrot.svg"
        });

        await CreateAsync(new Plant
        {
            Id = new Guid("ac500680-88ae-4edc-8cc9-85d1eacb4f3c")
            , Name = "Potato"
            , Description = "Potato is a starchy tuber that is often used as a vegetable in cooking. It is rich in carbohydrates and vitamins."
            , ImageUrl = "/plants/potato.svg"
        });

        var c = new Controller
        {
            Id = new Guid("f3948dbb-4c99-4173-86d6-3e24834639df"),
            Name = "Water Pump",
            Description = "Water pump is a device that moves water from one place to another. It is often used in irrigation systems.",
        };
        await CreateAsync(c);

        var s1 = new Sensor
        {
            Id = new Guid("52ff96f1-71f4-433f-829c-db07394e1aba")
            , Name = "Temperature"
            , Description = "Temperature sensor is a device that measures the temperature of the environment. It is often used in weather stations."
            , Min = 0
            , Max = 100
            , Unit = "C"
            , Type = SensorType.Temperature
        };
        await CreateAsync(s1);

        var s2 = new Sensor
        {
            Id = new Guid("28525480-9434-4318-82f7-3d89cb231166")
            , Name = "Humidity"
            , Description = "Humidity sensor is a device that measures the humidity of the environment. It is often used in weather stations."
            , Min = 0
            , Max = 100
            , Unit = "%"
            , Type = SensorType.Humidity
        };
        await CreateAsync(s2);

        await context.SaveChangesAsync();

        var Bed = new Bed
        {
            Id = new Guid("a3c51a2a-0b07-442f-af31-3b7d88dda10d")
            , Name = "Test Bed"
            , Description = "Test Bed"
            , PlantId = p.Id
        };

        Bed.Controllers.AddRange(c);
        Bed.Sensors.AddRange(s1, s2);
        await CreateOrUpdateAsync(Bed);

        await context.SaveChangesAsync();
    }
}