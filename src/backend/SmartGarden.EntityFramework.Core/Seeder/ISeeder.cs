namespace SmartGarden.EntityFramework.Core.Seeder;

public interface ISeeder
{
    Task SeedAsync();
}