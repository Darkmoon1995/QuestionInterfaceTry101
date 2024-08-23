using Microsoft.AspNetCore.Identity;
using QuestionInterfaceTry101.Server.Model;

namespace QuestionInterfaceTry101.Server.Data
{
    public class ApplicationUser : IdentityUser
    {

        public ICollection<WorksheetModel> Worksheets { get; set; } = new List<WorksheetModel>();
    }
}