using Quartz;

namespace SmartGarden.Scheduling;

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

    public static IServiceCollectionQuartzConfigurator AddJobAdvanced<T>(
        this IServiceCollectionQuartzConfigurator configurator,
        TimeSpan interval) 
        where T : IJob
    {
        var name = typeof(T).Name;
        var jobKey = new JobKey(name);
        configurator.AddJob<T>(o => o.WithIdentity(jobKey));

        configurator.AddTrigger(op =>
        {
            var t = op.ForJob(jobKey)
              .WithIdentity($"{name}Trigger")
              .WithSimpleSchedule(b => b.WithInterval(interval).RepeatForever());
        });
        
        return configurator;
    }
}