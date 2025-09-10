using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Core;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework;

public class PlantsDbContext(DbContextOptions options) : BaseDbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
    }
}