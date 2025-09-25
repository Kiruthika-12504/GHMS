public class BookingRequest
{
    public int Id { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public string OccupancyCategory { get; set; } = string.Empty; // Single/Double
    public string SubCategory { get; set; } = string.Empty; // Spouse/Parent/Other
    public string GuestEmail { get; set; } = string.Empty;
    public string HrEmail { get; set; } = string.Empty;
    public DateTime? CheckInDate { get; set; }
    public DateTime? CheckOutDate { get; set; }
    public string Department { get; set; } = string.Empty;
    public string BandLevel { get; set; } = string.Empty;
    public int RoomId { get; set; }
    public string RoomNumber { get; set; } = string.Empty; // Added for easier UI binding
    public string RoomType { get; set; } = string.Empty;   // Added for easier UI binding
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string Remarks { get; set; } = string.Empty;
    public string ApprovalDocument { get; set; } = string.Empty; // Path to uploaded doc
    public DateTime? TentativeBlockUntil { get; set; }
    public DateTime RequestDate { get; set; } = DateTime.Now;
}

public enum BookingStatus
{
    Pending,
    Approved,
    Rejected,
    Tentative
}
