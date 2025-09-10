namespace SmartGarden.EntityFramework;

public class DatabaseSettings
{
    public string Type { get; set; }
    public ConnectionStrings ConnectionStrings { get; set; }
}

public class ConnectionStrings : Dictionary<string, string>;