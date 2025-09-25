using GHMS.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace GHMS.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private static List<Room> rooms = new()
        {
            new Room { Id = 1, Name = "Room A", IsAvailable = true },
            new Room { Id = 2, Name = "Room B", IsAvailable = true },
            new Room { Id = 3, Name = "Room C", IsAvailable = true }
        };

        [HttpGet]
        public IActionResult GetRooms() => Ok(rooms);
    }
}
