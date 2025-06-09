namespace SmartGarden.AuthService.Services;

public interface ITokenValidator
{
    (bool IsValid, string? UserId) Validate(string token);
}