using SmartEvent.SmartEvent.Core.Models;
using SmartEvent.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartEvent.SmartEvent.Core.Models.SmartEvent.Core;
using SmartEvent.SmartEvent.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using SmartEvent.SmartEvent.Data;

namespace SmartEvent.Services.Implementations
{
    public class ParticipationService : IParticipationService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IRegistrationRepository _registrationRepository;
        private readonly AppDbContext _context;

        public ParticipationService(
            IEventRepository eventRepository,
            IRegistrationRepository registrationRepository,
            AppDbContext context)
        {
            _eventRepository = eventRepository;
            _registrationRepository = registrationRepository;
            _context = context;
        }

        public async Task<Registration> ParticipateToEventAsync(int eventId, string userId, string email)
        {
            // Validation des entrées
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("L'identifiant utilisateur est requis", nameof(userId));

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("L'email est requis", nameof(email));

            if (eventId <= 0)
                throw new ArgumentException("ID d'événement invalide", nameof(eventId));

            // Vérification de l'existence de l'événement
            var eventItem = await _context.Events
                .Include(e => e.Registrations)
                .FirstOrDefaultAsync(e => e.Id == eventId);

            if (eventItem == null)
                throw new KeyNotFoundException("Événement non trouvé");

            // Vérification de la double participation
            if (await _registrationRepository.IsUserRegisteredAsync(eventId, userId))
                throw new InvalidOperationException("Vous participez déjà à cet événement");

            // Vérification de la capacité
            var currentParticipants = await _registrationRepository.GetCountForEventAsync(eventId);
            if (currentParticipants >= eventItem.Capacity)
                throw new InvalidOperationException("L'événement a atteint sa capacité maximale");

            // Création de la participation
            var registration = new Registration
            {
                EventId = eventId,
                UserId = userId,
                Email = email,
                RegistrationDate = DateTime.UtcNow
            };

            // Mise à jour du nombre de participants actuels
            eventItem.CurrentParticipants = currentParticipants + 1;

            // Sauvegarder les changements
            await _context.Registrations.AddAsync(registration);
            await _context.SaveChangesAsync();

            return registration;
        }

        public async Task<bool> CheckUserParticipationAsync(int eventId, string userId)
        {
            if (string.IsNullOrWhiteSpace(userId) || eventId <= 0)
                return false;

            return await _registrationRepository.IsUserRegisteredAsync(eventId, userId);
        }

        public async Task<IEnumerable<Registration>> GetEventParticipantsAsync(int eventId)
        {
            if (eventId <= 0)
                throw new ArgumentException("ID d'événement invalide", nameof(eventId));

            return await _registrationRepository.GetByEventIdAsync(eventId);
        }
    }
}