using System.Net;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServiceDiscovery();

builder.Services.ConfigureHttpClientDefaults(http =>
{
    http.AddServiceDiscovery();
});

builder.Services.AddReverseProxy()
    .ConfigureHttpClient((context, handler) =>
    {
        handler.AllowAutoRedirect = false;
    })
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(builderContext =>
    {
        builderContext.AddResponseTransform(ctx =>
        {
            // get ProxyBasePath by computing difference between ProxyRequest and HttpContext.Request


            var t = ctx;
            //if (ctx.ProxyResponse.StatusCode == HttpStatusCode.Moved)
            //{
            //    var newLoc = ctx.ProxyResponse.Headers.Location.ToString().Replace(ctx.ProxyResponse.RequestMessage.Headers.);

            //    ctx.HttpContext.Response.Headers.Location = 
            //}
            return ValueTask.CompletedTask;
            
        });
    })
    .AddServiceDiscoveryDestinationResolver();
 
var app = builder.Build();
 
app.MapReverseProxy();
 
app.Run();