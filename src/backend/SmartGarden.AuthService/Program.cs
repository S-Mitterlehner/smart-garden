using SmartGarden.AuthService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddGrpc();
builder.Services.AddControllers();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenValidator, TokenValidator>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcService<AuthGrpcService>();

app.Run();