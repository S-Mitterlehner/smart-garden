using SmartGarden.Gateway;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddServiceDiscovery();

builder.Services.ConfigureHttpClientDefaults(http =>
{
    http.AddServiceDiscovery();
});

builder.Services.AddCors();


builder.Services.AddSingleton<GraphQLPathFixer>();
builder.Services.AddReverseProxy()
    .ConfigureHttpClient((context, handler) =>
    {
        handler.AllowAutoRedirect = false;
    })
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddServiceDiscoveryDestinationResolver();

var app = builder.Build();

List<string> allowedHosts = ["localhost", "studio.apollographql.com"];

app.UseCors(o =>
{
    o.SetIsOriginAllowed(origin =>
    {
        var host = new Uri(origin).Host;
        return allowedHosts.Any(x => x == host);
    });
    
    o.AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials();
});

app.MapReverseProxy(b =>
{
    b.UseMiddleware<GraphQLPathFixer>();
});
 
app.Run();
