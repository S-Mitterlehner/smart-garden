using Microsoft.EntityFrameworkCore;

namespace SmartGarden.EntityFramework;

public class PostgresSqlApplicationDbContext(DbContextOptions options, ConnectionStrings connStrings) : ApplicationDbContext(options)
{
    internal const string CONNECTION_STRING_KEY = "PostgresSql";
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        optionsBuilder.UseNpgsql(connStrings[CONNECTION_STRING_KEY]);
    }
}

public class PostgresSqlApplicationDesignTimeFactory(IServiceProvider serviceProvider) 
    : BaseApplicationContextDesignTimeFactory<PostgresSqlApplicationDbContext>(serviceProvider);