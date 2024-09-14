using System.ComponentModel.DataAnnotations;

namespace QuestionInterfaceTry101.Server.Model
{
    public class UserModel
    {
        [Required]
        public string Username { get; set; } = "NoUsername";

        public ProductImage? ProfilePicture { get; set; } 

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; }
    }

    public class ProductImage
    {
        [Key]
        public int ProductId { get; private set; }

        [Required]
        public byte[] Image { get; set; } 
    }

    public class ChangePasswordModel
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "New password must be at least 6 characters long")]
        public string NewPassword { get; set; }
    }
}
