namespace GHMS.Shared.Models
{
    public class EmailRequest
    {
        public string[] Recipients { get; set; } = Array.Empty<string>();
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}
