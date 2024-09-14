using Microsoft.AspNetCore.Identity;
using System;

namespace QuestionInterfaceTry101.Server.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string ProfilePictureUrl { get; set; } // Store a URL for the user's profile picture
        public DateTime DateCreated { get; set; } = DateTime.UtcNow; // Store the date the user was created
    }
}
