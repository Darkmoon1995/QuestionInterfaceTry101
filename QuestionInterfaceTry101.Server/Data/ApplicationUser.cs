using Microsoft.AspNetCore.Identity;

namespace QuestionInterfaceTry101.Server.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; } // User's display name
        public string ProfilePicture { get; set; } // URL or path to the user's profile picture
    }
}
