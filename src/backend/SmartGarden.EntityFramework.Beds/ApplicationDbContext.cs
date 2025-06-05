using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Beds.Models;
using SmartGarden.EntityFramework.Core;

namespace SmartGarden.EntityFramework.Beds;

public class ApplicationDbContext(DbContextOptions options) : BaseDbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Plant>();
        modelBuilder.Entity<PlantModuleConfig>();
        modelBuilder.Entity<ModuleRef>();

        modelBuilder.Entity<AutomationRule>();
        modelBuilder.Entity<AutomationRuleAction>();

        modelBuilder.Entity<Bed>()
                    .HasMany(x => x.Modules)
                    .WithMany()
                    .UsingEntity<Dictionary<string, object>>(
                        "BedModule",
                        x => x.HasOne<ModuleRef>().WithMany().HasForeignKey("ModuleId"),
                        x => x.HasOne<Bed>().WithMany().HasForeignKey("BedId"),
                        x =>
                        {
                            x.HasKey("BedId", "ModuleId");
                        });
    }
}