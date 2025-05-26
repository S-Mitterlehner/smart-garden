namespace SmartGarden.EntityFramework.Core.Seeding;

public interface ISeeder
{
    Task SeedAsync();
}