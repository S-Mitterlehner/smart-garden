namespace SmartGarden.Api.Dtos.Module;

public class ModuleDto : ModuleRefDto
{
    public string Description { get; set; }
    public ModuleStateDto State { get; set; }
}