namespace SmartGarden.EntityFramework.Core;

public static class DbContextExtensions
{
    public static IQueryable Set(this BaseDbContext context, Type entityType)
    {
        var methods = typeof(BaseDbContext).GetMethods();//nameof(BaseDbContext.Set), BindingFlags.Public | BindingFlags.Instance);
        var method = methods.FirstOrDefault(x => x.Name == nameof(BaseDbContext.Set));
        var genericMethod = method.MakeGenericMethod(entityType);
        return (IQueryable)genericMethod.Invoke(context, null);
    }
}
