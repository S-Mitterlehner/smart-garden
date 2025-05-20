using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

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
}