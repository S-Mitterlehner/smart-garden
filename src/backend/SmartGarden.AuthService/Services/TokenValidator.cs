namespace SmartGarden.AuthService.Services;

public class TokenValidator : ITokenValidator
{
    public (bool IsValid, string? UserId) Validate(string token)
    {
        // TODO
        return (true, token);
    }
}