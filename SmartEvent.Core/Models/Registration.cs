using System;

namespace SmartEvent.SmartEvent.Core.Models
{
    namespace SmartEvent.Core
    {
        public class Registration
        {
            public int Id { get; set; }
            public int EventId { get; set; }
            public string? UserId { get; set; }
            public required string Email { get; set; }
            public DateTime RegistrationDate { get; set; }
            public virtual Event? Event { get; set; }
        }
    }
}
