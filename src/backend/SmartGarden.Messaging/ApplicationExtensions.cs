using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SmartGarden.Messaging.Models;

namespace SmartGarden.Messaging;

public static class ApplicationExtensions
{
    public static IServiceCollection AddMessaging(this IServiceCollection services, IConfigurationSection configuration)
    {
        services.Configure<RabbitMQSettings>(configuration);
        services.AddSingleton<IMessagingProducer, RabbitMQMessagingProducer>();

        return services;
    }
}