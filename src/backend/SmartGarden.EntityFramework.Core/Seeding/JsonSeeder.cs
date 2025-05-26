using System.Collections;
using System.Text.Json;
using System.Text.Json.Serialization;
using Castle.Core.Internal;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartGarden.EntityFramework.Core.Models;

namespace SmartGarden.EntityFramework.Core.Seeding;

public class JsonSeeder<TSeedModel, TContext>(string path, TContext db, ILogger<JsonSeeder<TSeedModel, TContext>> logger) : BaseSeeder(db) where TContext : BaseDbContext
{
    private readonly Dictionary<Guid, BaseEntity> _entities = new();

    protected override async Task Initialize()
    {
        logger.LogTrace("Start Seeding from Json-File {path}", path);
        var strategy = db.Database.CreateExecutionStrategy();

        try
        {
            await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await db.Database.BeginTransactionAsync();
                try
                {
                    await using var fs = new FileStream(path, FileMode.Open, FileAccess.Read);
                    var options = new JsonSerializerOptions {PropertyNameCaseInsensitive = true,};
                    options.Converters.Add(new JsonStringEnumConverter());

                    var model = await JsonSerializer.DeserializeAsync<TSeedModel>(fs, options);

                    if (model is null)
                    {
                        logger.LogError("Failed to deserialize seed model from {path}", path);
                        return;
                    }

                    var properties = typeof(TSeedModel).GetProperties().OrderBy(p =>
                    {
                        var attr = p.GetAttribute<SeedOrderAttribute>();
                        return attr?.Order ?? int.MaxValue;
                    });

                    foreach (var propInfo in properties)
                    {
                        var value = propInfo.GetValue(model);
                        if (value is IEnumerable list && value.GetType().IsGenericType)
                        {
                            var elementType = value.GetType().GetGenericArguments()[0];
                            if (!elementType.IsAssignableTo(typeof(BaseEntity))) continue;

                            await LoadExistingByType(elementType);

                            foreach (var item in list)
                            {
                                ReplaceChildren(item);
                                
                                if (item is not BaseEntity entity) continue;

                                _entities.Add(entity.Id, entity);
                                await db.AddAsync(entity);
                                await db.SaveChangesAsync();
                            }
                        }
                    }

                    await transaction.CommitAsync();
                    logger.LogInformation("Seeding completed from Json-File {path}", path);

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    logger.LogError(ex, "Seeding did not run properly for path {path}: {exception}", path, ex.Message);
                }
            });
        }
        catch (Exception ex)
        {
            logger.LogCritical(ex, "Seeding failed critically for path {path}: {exception}", path, ex.Message);
        }
    }

    private async Task LoadExistingByType(Type elementType)
    {
        var existingEntities = await db.Set(elementType).Cast<BaseEntity>().ToListAsync();
        foreach (var entity in existingEntities)
        {
            _entities.Add(entity.Id, entity);
        }
    }

    private void ReplaceChildren(object item)
    {
        if (item is not BaseEntity entity) return;

        var properties = entity.GetType().GetProperties();

        foreach (var itemPropInfo in properties)
        {
            var val = itemPropInfo.GetValue(item);
            if (val is not IList itemList || !val.GetType().IsGenericType) continue;

            var elementType = val.GetType().GetGenericArguments()[0];
            if (!elementType.IsAssignableTo(typeof(BaseEntity))) continue;

            var list = itemList.Cast<BaseEntity>().ToList();
            foreach (var element in list)
            {
                if (_entities.TryGetValue(element.Id, out var existing))
                {
                    itemList.Remove(element);
                    itemList.Add(existing);
                }
            }
        }
    }
}