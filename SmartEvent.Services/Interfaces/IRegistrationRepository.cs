using SmartEvent.SmartEvent.Core.Models.SmartEvent.Core;

namespace SmartEvent.SmartEvent.Services.Interfaces
{
    public interface IRegistrationRepository
    {
        Task<Registration> GetByIdAsync(int id);
        Task<IEnumerable<Registration>> GetByEventIdAsync(int eventId);
        Task<Registration> CreateAsync(Registration entity);
        Task DeleteAsync(int id);
        Task<bool> IsUserRegisteredAsync(int eventId, string userId);
        Task<int> GetCountForEventAsync(int eventId);
        Task<Registration> GetByUserAndEventAsync(string userId, int eventId);
    }
}
