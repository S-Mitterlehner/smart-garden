namespace SmartGarden.EntityFramework.Core.Seeding;

public class SeedOrderAttribute(int order = int.MaxValue) : Attribute
{
    public int Order => order;
}