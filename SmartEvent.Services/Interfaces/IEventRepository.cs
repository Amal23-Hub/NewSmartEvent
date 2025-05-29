using SmartEvent.SmartEvent.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartEvent.SmartEvent.Services.Interfaces
{
    public interface IEventRepository
    {
        Task<Event> GetByIdAsync(int id);
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event> CreateAsync(Event entity);
        Task UpdateAsync(Event entity);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
