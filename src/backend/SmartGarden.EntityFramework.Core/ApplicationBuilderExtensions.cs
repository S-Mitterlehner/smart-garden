using Microsoft.Extensions.DependencyInjection;
using SmartGarden.EntityFramework.Core.Seeding;

namespace SmartGarden.EntityFramework.Core;

public static class ApplicationBuilderExtensions
{
    public static IServiceCollection AddJsonSeeder<TSeedModel, TContext>(this IServiceCollection sc, string path) where TContext : BaseDbContext
    {
        sc.AddScoped<ISeeder>(sp => ActivatorUtilities.CreateInstance<JsonSeeder<TSeedModel, TContext>>(sp, path));
        return sc;
    }

    public static IServiceCollection AddDbInitializerWithJsonSeeder<TSeedModel, TContext>(this IServiceCollection sc, string path) where TContext : BaseDbContext
    {
        sc.AddScoped<ISeeder>(sp => ActivatorUtilities.CreateInstance<JsonSeeder<TSeedModel, TContext>>(sp, path));
        sc.AddHostedService<DbInitializer<TContext>>();
        return sc;
    }
}