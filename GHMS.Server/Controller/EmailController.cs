using GHMS.Server.Services;
using GHMS.Shared.Models;
using Microsoft.AspNetCore.Mvc;

namespace GHMS.Server.Controllers
{
    [ApiController]
    [Route("api/email")]
    public class EmailController : ControllerBase
    {
        private readonly EmailService _emailService;

        public EmailController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            await _emailService.SendEmailAsync(request);
            return Ok(new { message = "Email sent (development)!" });
        }
    }
}
