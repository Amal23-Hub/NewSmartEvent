using SmartEvent.SmartEvent.Core.Models.SmartEvent.Core;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartEvent.SmartEvent.Services.Interfaces
{
    public interface IParticipationService
    {
        Task<Registration> ParticipateToEventAsync(int eventId, string userId, string email);
        Task<bool> CheckUserParticipationAsync(int eventId, string userId);
        Task<IEnumerable<Registration>> GetEventParticipantsAsync(int eventId);
    }
} 