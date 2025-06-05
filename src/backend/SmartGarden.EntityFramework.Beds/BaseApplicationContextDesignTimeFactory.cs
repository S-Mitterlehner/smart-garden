using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SmartGarden.EntityFramework.Beds;

public abstract class BaseApplicationContextDesignTimeFactory<T> : IDesignTimeDbContextFactory<T> where T : ApplicationDbContext
{
    private readonly IServiceProvider _serviceProvider;
    protected IConfigurationRoot Config { get; }

    protected DatabaseSettings Settings { get; }

    protected DbContextOptionsBuilder<T> OptionsBuilder { get; } = new();

    protected DbContextOptions<T> Options => OptionsBuilder.Options;

    protected BaseApplicationContextDesignTimeFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
        var path = Directory.GetCurrentDirectory();
        path = Path.Combine(path, "../SmartGarden.API/appsettings.json");
        
        Config = new ConfigurationBuilder()
                 .SetBasePath(Directory.GetCurrentDirectory())
                 .AddJsonFile(path)
                 .Build();

        var settings = new DatabaseSettings();
        Config.GetSection("Database").Bind(settings);
        Settings = settings;
    }

    public T CreateDbContext(string[] args) => ActivatorUtilities.CreateInstance<T>(_serviceProvider, Options, Settings.ConnectionStrings);
}