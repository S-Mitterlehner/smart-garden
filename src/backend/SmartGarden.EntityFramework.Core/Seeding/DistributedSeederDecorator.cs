using Medallion.Threading;

namespace SmartGarden.EntityFramework.Core.Seeding;

public class DistributedSeederDecorator<TSeeder>(TSeeder baseSeeder, IDistributedLockProvider lockProvider) : ISeeder where TSeeder : ISeeder
{
    public async Task SeedAsync()
    {
        var locker = lockProvider.CreateLock("SeedDatabase");
        await using var seedLock = await locker.TryAcquireAsync();

        if (seedLock is null) return;

        await baseSeeder.SeedAsync();
    }
}