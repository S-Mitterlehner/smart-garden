using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Plants.Models;

namespace SmartGarden.EntityFramework.Plants;

public class PlantsDbContext(DbContextOptions options) : BaseDbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Plant>();
        modelBuilder.Entity<PlantModuleConfig>();
    }
}