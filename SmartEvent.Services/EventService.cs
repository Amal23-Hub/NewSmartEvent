using Microsoft.EntityFrameworkCore;
using SmartEvent.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SmartEvent.SmartEvent.Core.Models;
using SmartEvent.SmartEvent.Data;

namespace SmartEvent.Services
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<EventService> _logger;

        public EventService(AppDbContext context, ILogger<EventService> logger)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Event> CreateEventAsync(Event eventModel)
        {
            try
            {
                if (eventModel.Date < DateTime.UtcNow.AddHours(1))
                    throw new InvalidOperationException("Event date must be in the future");

                if (eventModel.Capacity <= 0)
                    throw new InvalidOperationException("Capacity must be greater than zero");

                _context.Events.Add(eventModel);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Created event ID: {eventModel.Id}");
                return eventModel;
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Error creating event");
                throw new ApplicationException("Database error while creating event", ex);
            }
        }

        public async Task<IEnumerable<Event>> GetEventsAsync(bool includePastEvents = false)
        {
            var query = _context.Events
                .Include(e => e.Registrations)
                .AsQueryable();

            if (!includePastEvents)
                query = query.Where(e => e.Date >= DateTime.UtcNow);

            return await query.OrderBy(e => e.Date).ToListAsync();
        }

        public async Task<Event> GetEventByIdAsync(int id)
        {
            var eventItem = await _context.Events
                .Include(e => e.Registrations)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (eventItem == null)
            {
                _logger.LogWarning($"Event ID {id} not found");
                throw new KeyNotFoundException($"Event ID {id} not found");
            }

            return eventItem;
        }

        public async Task UpdateEventAsync(Event eventModel)
        {
            try
            {
                var existingEvent = await GetEventByIdAsync(eventModel.Id);

                if (eventModel.Capacity < existingEvent.Registrations.Count)
                    throw new InvalidOperationException(
                        $"New capacity ({eventModel.Capacity}) is less than current registrations ({existingEvent.Registrations.Count})");

                _context.Entry(existingEvent).CurrentValues.SetValues(eventModel);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Updated event ID {eventModel.Id}");
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, $"Concurrency error updating event ID {eventModel?.Id}");
                throw;
            }
        }

        public async Task DeleteEventAsync(int id)
        {
            var eventToDelete = await _context.Events.FindAsync(id);
            if (eventToDelete == null) return;

            try
            {
                _context.Events.Remove(eventToDelete);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Deleted event ID {id}");
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, $"Error deleting event ID {id}");
                throw new ApplicationException("Error while deleting event", ex);
            }
        }

        public async Task<bool> CheckEventCapacityAsync(int eventId)
        {
            var eventItem = await _context.Events
                .Include(e => e.Registrations)
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventItem == null)
                throw new KeyNotFoundException("Event not found");

            return eventItem.Registrations.Count < eventItem.Capacity;
        }

        public async Task<int> GetAvailableSeatsAsync(int eventId)
        {
            var eventItem = await GetEventByIdAsync(eventId);
            return eventItem.Capacity - eventItem.Registrations.Count;
        }

        public async Task ArchivePastEventsAsync()
        {
            var pastEvents = await _context.Events
                .Where(e => e.Date < DateTime.UtcNow.AddMonths(-1))
                .ToListAsync();

            foreach (var e in pastEvents)
            {
                // Implémentez votre logique d'archivage ici
                // Ex: e.IsArchived = true;
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation($"Archived {pastEvents.Count} events");
        }
    }
}