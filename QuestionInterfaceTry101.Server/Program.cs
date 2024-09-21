using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;

using Microsoft.IdentityModel.Tokens;
using QuestionInterfaceTry101.Server.Data;
using QuestionInterfaceTry101.Server.Model;
using System.Text;

namespace QuestionInterfaceTry101.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Database Configuration
            var connectionString = builder.Configuration.GetConnectionString("ApplicationDbContextConnection");

            // Using SQLite for local development
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(connectionString));  // Use SQLite for local environment

            // 2. Identity Configuration
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // 3. JWT Authentication Configuration
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)  // Use the secret key from appsettings.json
                };

                // Optional logging for JWT validation
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine($"Token validation failed: {context.Exception.Message}");
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = context =>
                    {
                        Console.WriteLine("Token validated successfully.");
                        return Task.CompletedTask;
                    }
                };
            });

            // 4. Enable CORS (for React frontend communication)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader());
            });

            // 5. Additional configurations
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            // Swagger setup (for API documentation)
            builder.Services.AddSwaggerGen(options =>
            {
                options.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
            });

            var app = builder.Build();

            // 6. Middleware pipeline configuration
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseCors("CorsPolicy");  // Apply CORS policy

            app.UseAuthentication();  // Authentication middleware
            app.UseAuthorization();   // Authorization middleware

            app.MapControllers();     // Map API controllers

            app.Run();
        }
    }
}
