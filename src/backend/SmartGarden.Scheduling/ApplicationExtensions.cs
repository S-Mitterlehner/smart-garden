using Microsoft.Extensions.DependencyInjection;
using Quartz;

namespace SmartGarden.Scheduling
{
    public static class ApplicationExtensions
    {
        public static IServiceCollection AddScheduler(this IServiceCollection sc, Action<IServiceCollectionQuartzConfigurator> configurator)
        {
            sc.AddQuartz(configurator);

            return sc;
        }
    }
}
