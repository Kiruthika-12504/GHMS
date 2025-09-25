namespace GHMS.Shared.Models
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
    }
}
