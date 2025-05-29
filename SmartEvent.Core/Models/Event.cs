using System;
using System.Collections.Generic;
using SmartEvent.SmartEvent.Core.Models.SmartEvent.Core;

namespace SmartEvent.SmartEvent.Core.Models
{
    public class Event
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public DateTime Date { get; set; }
        public required string Location { get; set; }
        public decimal Price { get; set; }
        public int Capacity { get; set; }
        public int CurrentParticipants { get; set; }
        public string? ImageUrl { get; set; }
        public string? Category { get; set; }
        public bool IsOnline { get; set; }
        public string? OnlineMeetingLink { get; set; }
        public string? Requirements { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public virtual ICollection<Registration> Registrations { get; set; } = new List<Registration>();
    }
}
