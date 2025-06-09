namespace SmartGarden.AuthService.Models;

public record LoginRequest
{
    public string Username { get; set; } = default!;
    public string Password { get; set; } = default!;
}