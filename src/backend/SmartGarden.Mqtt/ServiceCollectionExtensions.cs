using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MQTTnet;

namespace SmartGarden.Mqtt;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMqttClient(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddSingleton<IMqttClient>(sp =>
        {
            var config = sp.GetRequiredService<IOptions<MqttSettings>>().Value;
            
            var factory = new MqttClientFactory();
            var client = factory.CreateMqttClient();

            var options = new MqttClientOptionsBuilder()
                .WithClientId(config.ClientId)
                .WithTcpServer(config.Host, config.Port)
                .WithCredentials(config.Username, config.Password) // Optional
                .WithCleanSession()
                .Build();

            client.ConnectAsync(options, CancellationToken.None).GetAwaiter().GetResult();

            return client;
        });
        return serviceCollection;
    }
}