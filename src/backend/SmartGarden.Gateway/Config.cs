using System.Collections.ObjectModel;
using Microsoft.Extensions.Primitives;
using Yarp.ReverseProxy.Configuration;
using Yarp.ReverseProxy.Transforms;

namespace SmartGarden.Gateway;

public class Config : IProxyConfigProvider
{
    public IProxyConfig GetConfig() => new ProxyConfig();
}

public class ProxyConfig : IProxyConfig
{
    public IReadOnlyList<RouteConfig> Routes =>
    [
        new RouteConfig
        {
            Match = new RouteMatch
            {
                Path = "/api/beds/{**catch-all}"
            },
            Metadata = new Dictionary<string, string>
            {
                {"prefix", "/api/beds"}
            }
        }
    ];

    public IReadOnlyList<ClusterConfig> Clusters => [
        new ClusterConfig
        {
            ClusterId="beds",
            Destinations = new Dictionary<string, DestinationConfig>
            {
                { 
                    "beds/d1", new DestinationConfig
                    {
                        Address = "http://bed-api/"
                    }
                },
                {
                    "plants/d1", new DestinationConfig
                    {
                        Address = "http://plant-api/"
                    }
                }
            }
        }
    ];

    public IChangeToken ChangeToken => new CancellationChangeToken(CancellationToken.None); // ???
}