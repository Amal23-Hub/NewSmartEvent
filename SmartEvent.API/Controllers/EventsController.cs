using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEvent.SmartEvent.Core.Models;
using SmartEvent.SmartEvent.Data; // Pour AppDbContext
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SmartEvent.Services.Interfaces;

namespace SmartEvent.SmartEvent.Core.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IEventService _eventService;

        public EventsController(
            AppDbContext context, 
            IWebHostEnvironment environment,
            IEventService eventService)
        {
            _context = context;
            _environment = environment;
            _eventService = eventService;
        }

        // GET: api/Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            return await _context.Events.Include(e => e.Registrations).ToListAsync();
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var @event = await _context.Events
                .Include(e => e.Registrations)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (@event == null)
            {
                return NotFound();
            }

            return @event;
        }

        // GET: api/Events/active
        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Event>>> GetActiveEvents()
        {
            var currentDate = DateTime.UtcNow;
            var activeEvents = await _context.Events
                .Where(e => e.Date >= currentDate)
                .Include(e => e.Registrations)
                .ToListAsync();

            return activeEvents;
        }

        // DELETE: api/Events/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);
            if (@event == null)
            {
                return NotFound();
            }

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Events
        [HttpPost]
        public async Task<ActionResult<Event>> PostEvent([FromBody] Event eventModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validation des champs obligatoires
                if (string.IsNullOrWhiteSpace(eventModel.Name))
                    return BadRequest("Le nom de l'événement est requis");
                if (string.IsNullOrWhiteSpace(eventModel.Description))
                    return BadRequest("La description est requise");
                if (eventModel.Date < DateTime.UtcNow)
                    return BadRequest("La date doit être dans le futur");
                if (string.IsNullOrWhiteSpace(eventModel.Location))
                    return BadRequest("Le lieu est requis");
                if (eventModel.Capacity <= 0)
                    return BadRequest("La capacité doit être supérieure à 0");

                // Initialisation des valeurs par défaut
                eventModel.CurrentParticipants = 0;
                eventModel.CreatedAt = DateTime.UtcNow;

                // Création de l'événement
                var createdEvent = await _eventService.CreateEventAsync(eventModel);
                return CreatedAtAction(nameof(GetEvent), new { id = createdEvent.Id }, createdEvent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la création de l'événement", details = ex.Message });
            }
        }

        // PUT: api/Events/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvent(int id, [FromBody] Event eventModel)
        {
            try
            {
                if (id != eventModel.Id)
                {
                    return BadRequest("L'ID de l'événement ne correspond pas");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Validation des champs obligatoires
                if (string.IsNullOrWhiteSpace(eventModel.Name))
                    return BadRequest("Le nom de l'événement est requis");
                if (string.IsNullOrWhiteSpace(eventModel.Description))
                    return BadRequest("La description est requise");
                if (eventModel.Date < DateTime.UtcNow)
                    return BadRequest("La date doit être dans le futur");
                if (string.IsNullOrWhiteSpace(eventModel.Location))
                    return BadRequest("Le lieu est requis");
                if (eventModel.Capacity <= 0)
                    return BadRequest("La capacité doit être supérieure à 0");

                // Mise à jour de la date de modification
                eventModel.UpdatedAt = DateTime.UtcNow;

                await _eventService.UpdateEventAsync(eventModel);
                return Ok(new { message = "Événement mis à jour avec succès" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "Événement non trouvé" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erreur lors de la mise à jour de l'événement", details = ex.Message });
            }
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
}