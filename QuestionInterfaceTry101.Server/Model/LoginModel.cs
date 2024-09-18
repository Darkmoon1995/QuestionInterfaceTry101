namespace QuestionInterfaceTry101.Server.Model
{
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "User"; 
    }

    public class RegisterModel : LoginModel
    {
        public string? DisplayName { get; set; } 
        public string? ProfilePictureBase64 { get; set; }
    }
}
