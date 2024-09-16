using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using QuestionInterfaceTry101.Server.Data;
using QuestionInterfaceTry101.Server.Model;
using System.Threading.Tasks;

namespace QuestionInterfaceTry101.Server.ProgramCsCleaner
{
    public static class DatabaseSeeder
    {
        public static async Task SeedRolesAndAdminUser(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Create Admin role if it doesn't exist
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            // Create an admin user if it doesn't exist
            var adminUser = await userManager.FindByEmailAsync("admin@yourapp.com");
            if (adminUser == null)
            {
                var user = new ApplicationUser
                {
                    UserName = "admin@yourapp.com",
                    Email = "admin@yourapp.com"
                };

                var result = await userManager.CreateAsync(user, "AdminPassword123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }
        }
    }
}
