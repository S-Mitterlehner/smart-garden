using Microsoft.Extensions.DependencyInjection;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Core.Seeding;
using SmartGarden.EntityFramework.Distributed.Seeding;

namespace SmartGarden.EntityFramework.Distributed;

public static class ApplicationBuilderExtensions
{
    public static IServiceCollection AddDistributedJsonSeeder<TSeedModel, TContext>(this IServiceCollection sc, string path) where TContext : BaseDbContext
    {
        sc.AddScoped<ISeeder>(sp => ActivatorUtilities.CreateInstance<JsonSeeder<TSeedModel, TContext>>(sp, path));
        return sc;
    }

    public static IServiceCollection AddDistributedDbInitializerWithJsonSeeder<TSeedModel, TContext>(this IServiceCollection sc, string path) where TContext : BaseDbContext
    {
        sc.AddScoped<JsonSeeder<TSeedModel, TContext>>(sp => ActivatorUtilities.CreateInstance<JsonSeeder<TSeedModel, TContext>>(sp, path));
        sc.AddScoped<ISeeder, DistributedSeederDecorator<JsonSeeder<TSeedModel, TContext>>>();
        sc.AddHostedService<DbInitializer>();
        return sc;
    }
}