using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace GHMS.Functions
{
    public class TestFunction
    {
        private readonly ILogger _logger;

        public TestFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<TestFunction>();
        }

        [Function("TestFunction")]  // Function name visible in Azure
        public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req)
        {
            _logger.LogInformation("TestFunction executed.");

            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json");

            // Sample response
            response.WriteString("{\"message\": \"Hello from GHMS Function!\"}");
            return response;
        }
    }
}
