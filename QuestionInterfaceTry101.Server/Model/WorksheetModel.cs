using Microsoft.EntityFrameworkCore;
using QuestionInterfaceTry101.Server.Data;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Numerics;
using System.Text.Json.Serialization;

namespace QuestionInterfaceTry101.Server.Model
{
    public class WorksheetModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WorksheetId { get; set; }

        [Required]
        public int SkillId { get; set; }

        [Required]
        public int Number { get; set; }

        [Required]
        public int Level { get; set; }

        public TitleModel Title { get; set; } = new TitleModel();
        public FinalMessageModel FinalMessage { get; set; } = new FinalMessageModel();
        public string? WorksheetType { get; set; }
        public List<qusModel> qus { get; set; } = new List<qusModel>();

        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
    }

    [Owned]
    public class TitleModel
    {
        public string? Text { get; set; }
        public ConfigModel Config { get; set; } = new ConfigModel();
    }

    [Owned]
    public class FinalMessageModel
    {
        public string? Text { get; set; }
        public ConfigModel Config { get; set; } = new ConfigModel();
    }

    [Owned]
    public class ConfigModel
    {
        public string? Style { get; set; }
        public string? Styledegree { get; set; }
    }

    public class qusModel
    {
        [Key]
        [JsonIgnore]
        public int id { get; set; }
        public int Order { get; set; }

        public TitleModel Title { get; set; } = new TitleModel();
        public SettingsModel Settings { get; set; } = new SettingsModel();
        public int NumberOfOptions { get; set; }
        public int Sct { get; set; }
    }

    [Owned]
    public class SettingsModel
    {
        public string? Operation { get; set; }
        public int Number1 { get; set; }
        public int Number2 { get; set; }
    }
}
