﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using QuestionInterfaceTry101.Server.Data;

#nullable disable

namespace QuestionInterfaceTry101.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20240917185244_AddDisplayNameAndProfilePicture")]
    partial class AddDisplayNameAndProfilePicture
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("QuestionInterfaceTry101.Server.Data.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("ProfilePicture")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("QuestionInterfaceTry101.Server.Model.WorksheetModel", b =>
                {
                    b.Property<int>("WorksheetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("WorksheetId"));

                    b.Property<int>("Level")
                        .HasColumnType("int");

                    b.Property<int>("Number")
                        .HasColumnType("int");

                    b.Property<string>("OwnerEmail")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("SkillId")
                        .HasColumnType("int");

                    b.Property<string>("WorksheetType")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("WorksheetId");

                    b.ToTable("Worksheets");
                });

            modelBuilder.Entity("QuestionInterfaceTry101.Server.Model.qusModel", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("id"));

                    b.Property<int>("NumberOfOptions")
                        .HasColumnType("int");

                    b.Property<int>("Order")
                        .HasColumnType("int");

                    b.Property<int>("Sct")
                        .HasColumnType("int");

                    b.Property<int?>("WorksheetModelWorksheetId")
                        .HasColumnType("int");

                    b.HasKey("id");

                    b.HasIndex("WorksheetModelWorksheetId");

                    b.ToTable("qus", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("QuestionInterfaceTry101.Server.Data.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("QuestionInterfaceTry101.Server.Data.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("QuestionInterfaceTry101.Server.Data.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("QuestionInterfaceTry101.Server.Data.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("QuestionInterfaceTry101.Server.Model.WorksheetModel", b =>
                {
                    b.OwnsOne("QuestionInterfaceTry101.Server.Model.FinalMessageModel", "FinalMessage", b1 =>
                        {
                            b1.Property<int>("WorksheetModelWorksheetId")
                                .HasColumnType("int");

                            b1.Property<string>("Text")
                                .HasColumnType("nvarchar(max)");

                            b1.HasKey("WorksheetModelWorksheetId");

                            b1.ToTable("Worksheets");

                            b1.WithOwner()
                                .HasForeignKey("WorksheetModelWorksheetId");

                            b1.OwnsOne("QuestionInterfaceTry101.Server.Model.ConfigModel", "Config", b2 =>
                                {
                                    b2.Property<int>("FinalMessageModelWorksheetModelWorksheetId")
                                        .HasColumnType("int");

                                    b2.Property<string>("Style")
                                        .HasColumnType("nvarchar(max)");

                                    b2.Property<string>("Styledegree")
                                        .HasColumnType("nvarchar(max)");

                                    b2.HasKey("FinalMessageModelWorksheetModelWorksheetId");

                                    b2.ToTable("Worksheets");

                                    b2.WithOwner()
                                        .HasForeignKey("FinalMessageModelWorksheetModelWorksheetId");
                                });

                            b1.Navigation("Config")
                                .IsRequired();
                        });

                    b.OwnsOne("QuestionInterfaceTry101.Server.Model.TitleModel", "Title", b1 =>
                        {
                            b1.Property<int>("WorksheetModelWorksheetId")
                                .HasColumnType("int");

                            b1.Property<string>("Text")
                                .HasColumnType("nvarchar(max)");

                            b1.HasKey("WorksheetModelWorksheetId");

                            b1.ToTable("Worksheets");

                            b1.WithOwner()
                                .HasForeignKey("WorksheetModelWorksheetId");

                            b1.OwnsOne("QuestionInterfaceTry101.Server.Model.ConfigModel", "Config", b2 =>
                                {
                                    b2.Property<int>("TitleModelWorksheetModelWorksheetId")
                                        .HasColumnType("int");

                                    b2.Property<string>("Style")
                                        .HasColumnType("nvarchar(max)");

                                    b2.Property<string>("Styledegree")
                                        .HasColumnType("nvarchar(max)");

                                    b2.HasKey("TitleModelWorksheetModelWorksheetId");

                                    b2.ToTable("Worksheets");

                                    b2.WithOwner()
                                        .HasForeignKey("TitleModelWorksheetModelWorksheetId");
                                });

                            b1.Navigation("Config")
                                .IsRequired();
                        });

                    b.Navigation("FinalMessage")
                        .IsRequired();

                    b.Navigation("Title")
                        .IsRequired();
                });

            modelBuilder.Entity("QuestionInterfaceTry101.Server.Model.qusModel", b =>
                {
                    b.HasOne("QuestionInterfaceTry101.Server.Model.WorksheetModel", null)
                        .WithMany("qus")
                        .HasForeignKey("WorksheetModelWorksheetId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.OwnsOne("QuestionInterfaceTry101.Server.Model.SettingsModel", "Settings", b1 =>
                        {
                            b1.Property<int>("qusModelid")
                                .HasColumnType("int");

                            b1.Property<int>("Number1")
                                .HasColumnType("int");

                            b1.Property<int>("Number2")
                                .HasColumnType("int");

                            b1.Property<string>("Operation")
                                .HasColumnType("nvarchar(max)");

                            b1.HasKey("qusModelid");

                            b1.ToTable("qus");

                            b1.WithOwner()
                                .HasForeignKey("qusModelid");
                        });

                    b.OwnsOne("QuestionInterfaceTry101.Server.Model.TitleModel", "Title", b1 =>
                        {
                            b1.Property<int>("qusModelid")
                                .HasColumnType("int");

                            b1.Property<string>("Text")
                                .HasColumnType("nvarchar(max)");

                            b1.HasKey("qusModelid");

                            b1.ToTable("qus");

                            b1.WithOwner()
                                .HasForeignKey("qusModelid");

                            b1.OwnsOne("QuestionInterfaceTry101.Server.Model.ConfigModel", "Config", b2 =>
                                {
                                    b2.Property<int>("TitleModelqusModelid")
                                        .HasColumnType("int");

                                    b2.Property<string>("Style")
                                        .HasColumnType("nvarchar(max)");

                                    b2.Property<string>("Styledegree")
                                        .HasColumnType("nvarchar(max)");

                                    b2.HasKey("TitleModelqusModelid");

                                    b2.ToTable("qus");

                                    b2.WithOwner()
                                        .HasForeignKey("TitleModelqusModelid");
                                });

                            b1.Navigation("Config")
                                .IsRequired();
                        });

                    b.Navigation("Settings")
                        .IsRequired();

                    b.Navigation("Title")
                        .IsRequired();
                });

            modelBuilder.Entity("QuestionInterfaceTry101.Server.Model.WorksheetModel", b =>
                {
                    b.Navigation("qus");
                });
#pragma warning restore 612, 618
        }
    }
}
