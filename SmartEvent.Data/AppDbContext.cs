using SmartEvent.SmartEvent.Core.Models.SmartEvent.Core;
using SmartEvent.SmartEvent.Core.Models;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;


namespace SmartEvent.SmartEvent.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<Registration> Registrations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Registration>()
                .HasIndex(r => new { r.EventId, r.UserId })
                .IsUnique();

            modelBuilder.Entity<Event>()
                .Property(e => e.Price)
                .HasPrecision(10, 2); // 10 chiffres au total, dont 2 décimales
        }
    }
}
