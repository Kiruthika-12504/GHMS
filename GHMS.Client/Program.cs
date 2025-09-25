using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using GHMS;
using System.Net.Http;
using Syncfusion.Blazor;
using Syncfusion.Licensing;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// ✅ Register Syncfusion license key here
SyncfusionLicenseProvider.RegisterLicense("Ngo9BigBOggjHTQxAR8/V1JEaF1cWWhAYVF+WmFZfVtgcV9EaVZTQGYuP1ZhSXxWdkxhXX9bdHFXQWRYWUR9XEI=");

// Use HTTP for server API
builder.Services.AddScoped(sp =>
    new HttpClient { BaseAddress = new Uri("http://localhost:5259/") });

builder.Services.AddSyncfusionBlazor();


await builder.Build().RunAsync();
