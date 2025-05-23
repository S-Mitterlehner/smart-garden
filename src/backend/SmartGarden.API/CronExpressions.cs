namespace SmartGarden.API;

public static class CronExpressions
{
    public const string EveryMinute = "0 * * ? * *";
    public const string EveryFiveMinutes = "0 0/5 * ? * *";
    public const string EveryTenMinutes = "0 0/10 * ? * *";
    public const string EveryHour = "0 0 * ? * *";
}