using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using SmartEvent.SmartEvent.Core.Models;
using SmartEvent.Services;
using SmartEvent.Services.Implementations;
using SmartEvent.Services.Interfaces;
using SmartEvent.SmartEvent.Data.Repositories;
using SmartEvent.SmartEvent.Data;
using SmartEvent.SmartEvent.Services.Interfaces;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// ========== CONFIGURATION DES SERVICES ==========

// Configuration de la base de données
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()));

// Enregistrement des repositories
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IRegistrationRepository, RegistrationRepository>();

// Enregistrement des services
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IParticipationService, ParticipationService>();

// Configuration des contrôleurs avec gestion des références circulaires
builder.Services.AddControllers(options =>
{
    options.SuppressAsyncSuffixInActionNames = false;
})
.AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
    options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
    options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
});

// Configuration Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SmartEvent API",
        Version = "v1",
        Description = "API de gestion d'événements",
        Contact = new OpenApiContact
        {
            Name = "Votre Nom",
            Email = "contact@example.com",
            Url = new Uri("https://votresite.com")
        },
        License = new OpenApiLicense { Name = "MIT" }
    });

    try
    {
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            c.IncludeXmlComments(xmlPath);
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erreur chargement documentation XML: {ex.Message}");
    }
});

// Configuration CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .WithExposedHeaders("X-Pagination");
        }
        else
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .WithExposedHeaders("X-Pagination");
        }
    });
});

// ========== CONSTRUCTION DE L'APPLICATION ==========

var app = builder.Build();

// Gestion des migrations automatiques
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (app.Environment.IsDevelopment())
    {
        await dbContext.Database.MigrateAsync();
    }
    else
    {
        await dbContext.Database.CanConnectAsync();
    }
}

// Configuration du pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartEvent API v1");
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
    });
}

// Middleware de gestion des erreurs global
app.UseExceptionHandler("/error");

// Configuration des middlewares dans le bon ordre
app.UseRouting();

// Activer les fichiers statiques
app.UseStaticFiles();

// S'assurer que le dossier wwwroot existe
var wwwrootPath = app.Environment.WebRootPath;
if (string.IsNullOrEmpty(wwwrootPath))
{
    wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    if (!Directory.Exists(wwwrootPath))
    {
        Directory.CreateDirectory(wwwrootPath);
    }
}

// Créer le dossier wwwroot/uploads/events s'il n'existe pas
var uploadsPath = Path.Combine(wwwrootPath, "uploads", "events");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
    Console.WriteLine($"Dossier d'upload créé : {uploadsPath}");
}

// CORS doit être après UseRouting mais avant UseEndpoints
app.UseCors(policy =>
{
    if (app.Environment.IsDevelopment())
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("X-Pagination");
    }
    else
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("X-Pagination");
    }
});

// Endpoints
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapGet("/", () => Results.Json(new
    {
        message = "SmartEvent API is running!",
        documentation = "/swagger"
    }));
});

app.Map("/error", (HttpContext context) =>
{
    var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
    return Results.Problem(
        title: "Une erreur est survenue",
        detail: exception?.Message,
        statusCode: StatusCodes.Status500InternalServerError);
});

app.Run();
