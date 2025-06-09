using SmartGarden.Gateway;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServiceDiscovery();

builder.Services.ConfigureHttpClientDefaults(http =>
{
    http.AddServiceDiscovery();
});


builder.Services.AddSingleton<GraphQLPathFixer>();
builder.Services.AddReverseProxy()
    .ConfigureHttpClient((context, handler) =>
    {
        handler.AllowAutoRedirect = false;
    })
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddServiceDiscoveryDestinationResolver();
 
var app = builder.Build();
 
app.MapReverseProxy(b =>
{
    b.UseMiddleware<GraphQLPathFixer>();
});
 
app.Run();