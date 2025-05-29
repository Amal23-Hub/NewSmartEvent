
using SmartEvent.SmartEvent.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartEvent.Services.Interfaces
{
    public interface IEventService
    {
        Task<Event> CreateEventAsync(Event eventModel);
        Task<IEnumerable<Event>> GetEventsAsync(bool includePastEvents = false);
        Task<Event> GetEventByIdAsync(int id);
        Task UpdateEventAsync(Event eventModel);
        Task DeleteEventAsync(int id);
        Task<bool> CheckEventCapacityAsync(int eventId);
        Task<int> GetAvailableSeatsAsync(int eventId);
        Task ArchivePastEventsAsync();
    }
}