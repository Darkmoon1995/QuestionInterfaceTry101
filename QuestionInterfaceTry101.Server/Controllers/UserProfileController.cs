using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestionInterfaceTry101.Server.Data;
using QuestionInterfaceTry101.Server.Model;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;

namespace QuestionInterfaceTry101.Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _environment;
        private readonly ApplicationDbContext _dbContext;

        public UserProfileController(UserManager<ApplicationUser> userManager, IWebHostEnvironment environment, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _environment = environment;
            _dbContext = dbContext;
        }

        // PUT: api/UserProfile/UpdateProfile
        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UserProfileUpdateModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found.");

            // Update username and email
            user.UserName = model.UserName;
            user.Email = model.Email;

            // Update password if provided
            if (!string.IsNullOrEmpty(model.CurrentPassword) && !string.IsNullOrEmpty(model.NewPassword))
            {
                var passwordChangeResult = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
                if (!passwordChangeResult.Succeeded)
                {
                    return BadRequest(passwordChangeResult.Errors);
                }
            }

            // Update profile picture if provided
            if (model.ProfilePicture != null)
            {
                var fileName = $"{user.Id}_{Path.GetFileName(model.ProfilePicture.FileName)}";
                var filePath = Path.Combine(_environment.WebRootPath, "uploads", "profile_pictures", fileName);

                // Ensure the directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                // Save the file to the server
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ProfilePicture.CopyToAsync(stream);
                }

                // Optionally, you can save the file path to the database
                user.ProfilePictureUrl = $"/uploads/profile_pictures/{fileName}";
            }

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult.Errors);
            }

            return Ok("Profile updated successfully.");
        }

        // GET: api/UserProfile/GetProfile
        [HttpGet("GetProfile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound("User not found.");

            var profile = new
            {
                user.UserName,
                user.Email,
                ProfilePictureUrl = user.ProfilePictureUrl
            };

            return Ok(profile);
        }
    }

    // Model for updating the user profile
    public class UserProfileUpdateModel
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
        public IFormFile ProfilePicture { get; set; }
    }
}
