using Microsoft.AspNetCore.Identity;
using SmartGarden.EntityFramework.Core.Seeding;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework.Seeding;

public class DevSeeder(UserManager<User> userManager) : ISeeder
{
    public async Task SeedAsync()
    {
        if (await userManager.FindByNameAsync("test") != null)
        {
            return; // User already exists, no need to seed
        }

        var user = new User { UserName = "test" };
        await userManager.CreateAsync(user, "test1234");
    }
}