using SmartGarden.AuthService.Models;

namespace SmartGarden.AuthService.Services;

public interface IAuthService
{
    Task<(bool Success, string? Token, string? Error)> RegisterAsync(RegisterRequest request);
    Task<string?> LoginAsync(LoginModel model);
}