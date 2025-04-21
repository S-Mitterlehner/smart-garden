using System.ComponentModel.DataAnnotations;

namespace SmartGarden.EntityFramework.Models;

public class Plant : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }
}