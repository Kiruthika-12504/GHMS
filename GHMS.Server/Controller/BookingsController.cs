using GHMS.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace GHMS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        // In-memory list for demonstration
        private static List<BookingRequest> bookings = new();

        // Create a new booking
        [HttpPost("create")]
        public IActionResult CreateBooking([FromBody] BookingRequest request)
        {
            request.Id = bookings.Count + 1;
            request.Status = BookingStatus.Pending;
            request.RequestDate = DateTime.Now;
            bookings.Add(request);

            return Ok(new { message = "Booking created successfully!", bookingId = request.Id });
        }

        // Get pending bookings
        [HttpGet("pending")]
        public IActionResult GetPendingBookings()
        {
            var pending = bookings.Where(b => b.Status == BookingStatus.Pending).ToList();
            return Ok(pending);
        }

        // Get all bookings (history)
        [HttpGet("all")]
        public IActionResult GetAllBookings()
        {
            return Ok(bookings);
        }

        // Update booking status dynamically
        [HttpPost("update-status")]
        public IActionResult UpdateBookingStatus([FromBody] BookingRequest updated)
        {
            var booking = bookings.FirstOrDefault(b => b.Id == updated.Id);
            if (booking == null)
                return NotFound(new { message = "Booking not found" });

            booking.Status = updated.Status;
            booking.Remarks = updated.Remarks;
            booking.ApprovalDocument = updated.ApprovalDocument;
            booking.TentativeBlockUntil = updated.TentativeBlockUntil;

            return Ok(new { message = $"Booking {booking.Id} status updated to {booking.Status}" });
        }
    }
}
