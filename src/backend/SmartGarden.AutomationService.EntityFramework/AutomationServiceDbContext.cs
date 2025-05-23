using Microsoft.EntityFrameworkCore;
using SmartGarden.AutomationService.EntityFramework.Models;
using SmartGarden.EntityFramework.Core;

namespace SmartGarden.AutomationService.EntityFramework;

public class AutomationServiceDbContext(DbContextOptions options) : BaseDbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ModuleRef>();
        modelBuilder.Entity<AutomationRule>();
        modelBuilder.Entity<AutomationRuleAction>();
    }
}