using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using QuestionInterfaceTry101.Server.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using QuestionInterfaceTry101.Server.Data;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;

namespace QuestionInterfaceTry101.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<ApplicationUser> userManager,
                              SignInManager<ApplicationUser> signInManager,
                              RoleManager<IdentityRole> roleManager,
                              IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        // POST: api/Auth/Register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                DisplayName = model.DisplayName, // This could be null
                ProfilePicture = model.ProfilePictureBase64 // This could be null
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Ensure roles exist in the system
            await CreateRoles();

            // Assign the user to the specified role (default is "User")
            var role = string.IsNullOrEmpty(model.Role) ? "User" : model.Role;
            await _userManager.AddToRoleAsync(user, role);

            return Ok("User registered successfully.");
        }
        private async Task CreateRoles()
        {
            if (!await _roleManager.RoleExistsAsync("Admin"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            if (!await _roleManager.RoleExistsAsync("User"))
            {
                await _roleManager.CreateAsync(new IdentityRole("User"));
            }
        }

        // POST: api/Auth/Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (!result.Succeeded)
            {
                return BadRequest("Invalid login attempt.");
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            var token = await GenerateJwtToken(user);

            return Ok(new
            {
                Token = token,
                Username = user.DisplayName ?? user.Email, // Fallback to email if no display name is set
                ProfilePicture = user.ProfilePicture ?? string.Empty, // Return empty string if no profile picture is set
                Role = await _userManager.GetRolesAsync(user) // Return user's roles
            });
        }
        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] RegisterModel model)
        {
            // Log the incoming request data for debugging
            Console.WriteLine($"Received update request for user: {model.Email}, DisplayName: {model.DisplayName}");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Get the user's ID from the token
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                Console.WriteLine("User not found.");
                return NotFound(new { message = "User not found." });
            }

            // Validate incoming data with more detailed checks
            if (string.IsNullOrEmpty(model.Email))
            {
                Console.WriteLine("Email is missing.");
                return BadRequest(new { message = "Email is required." });
            }

            if (string.IsNullOrEmpty(model.DisplayName))
            {
                Console.WriteLine("DisplayName is missing.");
                return BadRequest(new { message = "DisplayName is required." });
            }

            // Log data before updating
            Console.WriteLine($"Updating user {user.Email}, DisplayName: {model.DisplayName}");

            // Update the user's profile details
            user.Email = model.Email; // Update email
            user.DisplayName = model.DisplayName ?? user.DisplayName; // Update display name
            user.ProfilePicture = model.ProfilePictureBase64 ?? user.ProfilePicture; // Update picture

            // Save changes and check for errors
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                Console.WriteLine("Profile updated successfully.");
                return Ok(new { message = "Profile updated successfully." });
            }
            else
            {
                // Log detailed errors for debugging
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Error: {error.Description}");
                }
                return BadRequest(new { message = "Failed to update profile.", errors = result.Errors });
            }
        }


        // Method to generate JWT token (includes roles)
        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            // Add user roles as claims
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToInt32(_configuration["Jwt:ExpiryDurationInMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
