using System.ComponentModel.DataAnnotations;

namespace SmartGarden.DataAccess.Models;

public class Plant : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
}