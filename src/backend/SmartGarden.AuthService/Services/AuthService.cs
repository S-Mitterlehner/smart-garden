using SmartGarden.AuthService.Models;

namespace SmartGarden.AuthService.Services;

public class AuthService : IAuthService
{
    public Task<(bool Success, string? Token, string? Error)> RegisterAsync(RegisterRequest request)
    {
        // TODO
        return Task.FromResult<(bool, string?, string?)>((true, "TestToken_12345678", null));
    }

    public Task<string?> LoginAsync(LoginRequest request)
    {
        // TODO
        return Task.FromResult<string?>("TestToken_12345678");
    }
}