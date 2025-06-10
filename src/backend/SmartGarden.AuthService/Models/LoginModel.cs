namespace SmartGarden.AuthService.Models;

public record LoginModel
{
    public string Username { get; set; } = default!;
    public string Password { get; set; } = default!;
}