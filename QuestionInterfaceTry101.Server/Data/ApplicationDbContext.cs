using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QuestionInterfaceTry101.Server.Model;
using static QuestionInterfaceTry101.Server.Model.UserModel;

namespace QuestionInterfaceTry101.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<WorksheetModel> Worksheets { get; set; }
        public DbSet<qusModel> qus { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Relationships and custom configurations
            builder.Entity<WorksheetModel>()
                   .OwnsOne(w => w.Title, t => { t.OwnsOne(tt => tt.Config); });
            builder.Entity<WorksheetModel>()
                   .OwnsOne(w => w.FinalMessage, f => { f.OwnsOne(ff => ff.Config); });

            builder.Entity<qusModel>()
                   .OwnsOne(q => q.Title, t => { t.OwnsOne(tt => tt.Config); });
            builder.Entity<qusModel>()
                   .OwnsOne(q => q.Settings);

            builder.Entity<WorksheetModel>()
                   .HasMany(w => w.qus)
                   .WithOne()
                   .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<qusModel>().ToTable("qus");

            // Additional custom user-related logic (optional)
            builder.Entity<ApplicationUser>()
                   .Property(u => u.ProfilePictureUrl)
                   .HasMaxLength(256);  
        }
    }
}
