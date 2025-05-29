using SmartEvent.SmartEvent.Core.Models.SmartEvent.Core;
using SmartEvent.SmartEvent.Data;
using Microsoft.EntityFrameworkCore;
using SmartEvent.SmartEvent.Services.Interfaces;

public class RegistrationRepository : IRegistrationRepository
{
    private readonly AppDbContext _context;

    public RegistrationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Registration> GetByIdAsync(int id)
    {
        return await _context.Registrations
            .Include(r => r.Event)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Registration>> GetByEventIdAsync(int eventId)
    {
        return await _context.Registrations
            .Where(r => r.EventId == eventId)
            .Include(r => r.Event)
            .ToListAsync();
    }

    public async Task<Registration> CreateAsync(Registration entity)
    {
        await _context.Registrations.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task DeleteAsync(int id)
    {
        var registration = await _context.Registrations.FindAsync(id);
        if (registration != null)
        {
            _context.Registrations.Remove(registration);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> IsUserRegisteredAsync(int eventId, string userId)
    {
        return await _context.Registrations
            .AnyAsync(r => r.EventId == eventId && r.UserId == userId);
    }

    public async Task<int> GetCountForEventAsync(int eventId)
    {
        return await _context.Registrations
            .Where(r => r.EventId == eventId)
            .CountAsync();
    }

    public async Task<Registration> GetByUserAndEventAsync(string userId, int eventId)
    {
        return await _context.Registrations
            .FirstOrDefaultAsync(r => r.UserId == userId && r.EventId == eventId);
    }
}