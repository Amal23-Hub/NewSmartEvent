using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEvent.SmartEvent.Core.Models;
using SmartEvent.SmartEvent.Core.Models.SmartEvent.Core;
using SmartEvent.SmartEvent.Data; // Pour AppDbContext
using SmartEvent.SmartEvent.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace SmartEvent.SmartEvent.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class RegistrationsController : ControllerBase
    {
        private readonly IParticipationService _participationService;
        private readonly AppDbContext _context;

        public RegistrationsController(
            IParticipationService participationService,
            AppDbContext context)
        {
            _participationService = participationService;
            _context = context;
        }

        // POST: api/Registrations
        [HttpPost]
        public async Task<IActionResult> Participate([FromBody] Registration registration)
        {
            // Validation du modèle (si nécessaire)
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Données invalides" });
            }

            // Vérifier si l'événement existe
            var @event = await _context.Events.FirstOrDefaultAsync(e => e.Id == registration.EventId);
            if (@event == null)
            {
                return NotFound(new { message = "Événement non trouvé" });
            }

            // Vérification si l'utilisateur participe déjà à l'événement
            var existingRegistration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.EventId == registration.EventId && r.UserId == registration.UserId);
            if (existingRegistration != null)
            {
                return BadRequest(new { message = "Vous participez déjà à cet événement" });
            }

            // Ajouter la participation
            registration.Event = @event;
            _context.Registrations.Add(registration);

            // Sauvegarder les changements dans la base de données
            await _context.SaveChangesAsync();

            return Ok(new { message = "Participation réussie" });
        }

        /// <summary>
        /// Récupère la liste des participants d'un événement
        /// </summary>
        [HttpGet("{eventId}")]
        [ProducesResponseType(typeof(IEnumerable<Registration>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetParticipants(int eventId)
        {
            try
            {
                var participants = await _participationService.GetEventParticipantsAsync(eventId);
                return Ok(participants);
            }
            catch (ArgumentException)
            {
                return BadRequest(new { message = "ID d'événement invalide" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Une erreur est survenue", details = ex.Message });
            }
        }

        /// <summary>
        /// Permet de participer à un événement avec une adresse email
        /// </summary>
        [HttpPost("direct")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ParticipateDirect([FromBody] DirectRegistrationRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest(new { message = "L'email est requis" });
                }

                if (request.EventId <= 0)
                {
                    return BadRequest(new { message = "ID d'événement invalide" });
                }

                // Vérifier si l'événement existe et sa capacité
                var eventItem = await _context.Events
                    .Include(e => e.Registrations)
                    .FirstOrDefaultAsync(e => e.Id == request.EventId);

                if (eventItem == null)
                {
                    return NotFound(new { message = "Événement non trouvé" });
                }

                if (eventItem.CurrentParticipants >= eventItem.Capacity)
                {
                    return BadRequest(new { message = "L'événement a atteint sa capacité maximale" });
                }

                // Vérifier si l'email est déjà utilisé pour cet événement
                var existingRegistration = await _context.Registrations
                    .FirstOrDefaultAsync(r => r.EventId == request.EventId && r.Email == request.Email);

                if (existingRegistration != null)
                {
                    return BadRequest(new { message = "Vous participez déjà à cet événement avec cet email" });
                }

                // Créer la participation
                var registration = new Registration
                {
                    EventId = request.EventId,
                    Email = request.Email,
                    RegistrationDate = DateTime.UtcNow
                };

                // Mettre à jour le nombre de participants
                eventItem.CurrentParticipants++;

                // Sauvegarder les changements
                await _context.Registrations.AddAsync(registration);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Participation réussie", 
                    registration,
                    currentParticipants = eventItem.CurrentParticipants,
                    maxParticipants = eventItem.Capacity
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Une erreur est survenue lors de la participation", details = ex.Message });
            }
        }
    }

    public class DirectRegistrationRequest
    {
        public int EventId { get; set; }
        public required string Email { get; set; }
    }
}
