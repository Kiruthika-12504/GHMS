using GHMS.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSingleton<EmailService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowBlazorDevClient", policy =>
    {
        policy.WithOrigins("http://localhost:5134")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable Swagger in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "GHMS API V1");
        c.RoutePrefix = string.Empty; // Swagger at root: http://localhost:5259/
    });
}

// Middleware
app.UseCors("AllowBlazorDevClient");
app.UseHttpsRedirection();

app.MapControllers();


app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
