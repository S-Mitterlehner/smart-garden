namespace SmartGarden.EntityFramework.Seeder;

public interface ISeeder
{
    Task SeedAsync();
}