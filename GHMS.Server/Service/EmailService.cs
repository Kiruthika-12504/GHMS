using GHMS.Shared.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace GHMS.Server.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(EmailRequest request)
        {
            if (request.Recipients == null || !request.Recipients.Any())
            {
                _logger.LogWarning("No recipients provided for email: {Subject}", request.Subject);
                throw new ArgumentException("No recipients provided.");
            }

            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("GHMS", _config["Mail:From"]));

                foreach (var r in request.Recipients)
                {
                    if (!string.IsNullOrWhiteSpace(r))
                        message.To.Add(MailboxAddress.Parse(r));
                }

                message.Subject = request.Subject;
                message.Body = new TextPart("plain") { Text = request.Body };

                using var client = new SmtpClient();

                _logger.LogInformation("Connecting to SMTP server {Host}:{Port}", 
                    _config["Mail:SmtpHost"], _config["Mail:SmtpPort"]);

                await client.ConnectAsync(
                    _config["Mail:SmtpHost"], 
                    int.Parse(_config["Mail:SmtpPort"]), 
                    SecureSocketOptions.StartTls
                );

                _logger.LogInformation("Authenticating with SMTP server using user {Username}", _config["Mail:Username"]);
                await client.AuthenticateAsync(_config["Mail:Username"], _config["Mail:Password"]);

                _logger.LogInformation("Sending email to: {Recipients}", string.Join(", ", request.Recipients));
                await client.SendAsync(message);

                _logger.LogInformation("Email sent successfully to: {Recipients}", string.Join(", ", request.Recipients));
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {Recipients}", string.Join(", ", request.Recipients));
                throw; // Will trigger 500 in API, but now you can see detailed logs
            }
        }
    }
}
