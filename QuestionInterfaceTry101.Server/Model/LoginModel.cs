namespace QuestionInterfaceTry101.Server.Model
{
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "User"; // Default role is "User"
    }

    public class RegisterModel : LoginModel
    {
        public string DisplayName { get; set; } // Username
        public string? ProfilePictureBase64 { get; set; } // Base64 string for profile picture
    }
}
