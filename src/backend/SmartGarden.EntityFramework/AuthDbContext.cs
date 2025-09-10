using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartGarden.EntityFramework.Models;

namespace SmartGarden.EntityFramework
{
    public class AuthDbContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {

    }
}
