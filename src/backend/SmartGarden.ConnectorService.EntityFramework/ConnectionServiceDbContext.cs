using Microsoft.EntityFrameworkCore;
using SmartGarden.ConnectorService.EntityFramework.Models;
using SmartGarden.EntityFramework.Core;

namespace SmartGarden.ConnectorService.EntityFramework;

public class ConnectionServiceDbContext(DbContextOptions options) : BaseDbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ModuleRef>();
    }
}