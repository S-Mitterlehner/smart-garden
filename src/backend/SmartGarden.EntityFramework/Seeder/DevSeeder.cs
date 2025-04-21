using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework.Seeder;

public class DevSeeder(ApplicationContext context) : BaseSeeder(context)
{
    protected override async Task Initialize()
    {
        await CreateAsync(new Plant
        {
            Id = new Guid("05c7919a-1225-4ee3-b5ea-ac720f1af14b")
            , Name = "Tomato"
            , Description = "Tomato is a fruit that is often used as a vegetable in cooking. It is rich in vitamins and antioxidants."
            , ImageUrl = "/plants/tomato.svg"
        });

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
    }
}