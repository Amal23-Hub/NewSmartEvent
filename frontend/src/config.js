// Configuration de l'API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5034';

// Configuration des messages
export const MESSAGES = {
    EVENT_CREATED: 'Événement créé avec succès !',
    EVENT_UPDATED: 'Événement mis à jour avec succès !',
    EVENT_DELETED: 'Événement supprimé avec succès !',
    ERROR_CREATING_EVENT: 'Erreur lors de la création de l\'événement',
    ERROR_UPDATING_EVENT: 'Erreur lors de la mise à jour de l\'événement',
    ERROR_DELETING_EVENT: 'Erreur lors de la suppression de l\'événement',
    ERROR_LOADING_EVENTS: 'Erreur lors du chargement des événements',
    ERROR_LOADING_EVENT: 'Erreur lors du chargement de l\'événement',
    NO_EVENTS: 'Aucun événement trouvé',
    LOADING: 'Chargement...',
    VALIDATION: {
        REQUIRED_FIELD: 'Ce champ est requis',
        INVALID_DATE: 'La date doit être dans le futur',
        INVALID_CAPACITY: 'La capacité doit être supérieure à 0',
        INVALID_PRICE: 'Le prix doit être un nombre positif',
        INVALID_EMAIL: 'L\'adresse email n\'est pas valide',
        INVALID_PHONE: 'Le numéro de téléphone n\'est pas valide',
        INVALID_URL: 'L\'URL n\'est pas valide'
    }
};

// Configuration des endpoints
export const ENDPOINTS = {
    EVENTS: '/Events',
    REGISTRATIONS: '/Registrations',
    USERS: '/Users'
}; 