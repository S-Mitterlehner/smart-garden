using Quartz;

namespace SmartGarden.API;

public static class QuartzExtensions
{
    public static IServiceCollectionQuartzConfigurator AddJobAdvanced<T>(
        this IServiceCollectionQuartzConfigurator configurator,
        string cronExpression) 
        where T : IJob
    {
        var name = typeof(T).Name;
        var jobKey = new JobKey(name);
        configurator.AddJob<T>(o => o.WithIdentity(jobKey));

        configurator.AddTrigger(op =>
        {
            op.ForJob(jobKey)
                .WithIdentity($"{name}Trigger")
                .WithCronSchedule(cronExpression);
        });
        
        return configurator;
    }
}