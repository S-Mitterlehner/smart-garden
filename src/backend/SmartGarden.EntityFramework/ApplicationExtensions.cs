using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Core.Seeding;
using SmartGarden.EntityFramework.Seeding;

namespace SmartGarden.EntityFramework;

public static class ApplicationExtensions
{
    public static IServiceCollection RegisterDbContext(this IServiceCollection sc, IConfiguration config)
    {
        sc.Configure<DatabaseSettings>(config.GetSection("Database"));
        sc.AddSingleton<ConnectionStrings>(s => s.GetRequiredService<IOptions<DatabaseSettings>>().Value.ConnectionStrings);

        var dbType = config["Database:Type"];
        switch (dbType)
        {
            case "PostgresSql":
            default:
                sc.AddDbContext<ApplicationDbContext, PostgresSqlApplicationDbContext>();
                break;
        }

        return sc;
    }
    
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