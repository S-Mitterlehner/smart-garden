using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Auth.Models;

namespace SmartGarden.EntityFramework.Auth
{
    public class AuthDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {

    }
}
