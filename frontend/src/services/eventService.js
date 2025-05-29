import { API_BASE_URL } from '../config';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Une erreur est survenue');
    }
    return response.json();
};

// Configuration du timeout pour les requêtes
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('La requête a expiré. Veuillez réessayer.');
        }
        throw new Error('Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.');
    }
};

// Récupérer tous les événements
export const getEvents = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events`);
        return handleResponse(response);
    } catch (error) {
        console.error('Erreur lors de la récupération des événements:', error);
        throw error;
    }
};

// Récupérer un événement par son ID
export const getEventById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/${id}`);
        return handleResponse(response);
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'événement ${id}:`, error);
        throw error;
    }
};

// Fonction d'inscription
export const registerForEvent = async (eventId, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventId,
                ...userData
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erreur lors de l\'inscription à l\'événement:', error);
        throw error;
    }
};

// Fonction pour récupérer les participants d'un événement
export const getEventParticipants = async (eventId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Registrations/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des participants:', error);
        throw error;
    }
};

// Créer un nouvel événement
export const createEvent = async (formData) => {
    try {
        // Validation des données requises
        const name = formData.get('name')?.trim();
        const description = formData.get('description')?.trim();
        const date = formData.get('date');
        const location = formData.get('location')?.trim();
        const capacity = formData.get('capacity');
        const price = formData.get('price');
        const imageUrl = formData.get('imageUrl');

        // Validation des champs requis
        if (!name) throw new Error('Le nom de l\'événement est requis');
        if (!description) throw new Error('La description est requise');
        if (!date) throw new Error('La date est requise');
        if (!location) throw new Error('Le lieu est requis');
        if (!capacity || isNaN(parseInt(capacity)) || parseInt(capacity) <= 0) {
            throw new Error('Le nombre de participants doit être un nombre positif');
        }

        // Vérification de la date
        const eventDate = new Date(date);
        const now = new Date();
        if (eventDate < now) {
            throw new Error('La date de l\'événement doit être dans le futur');
        }

        // Préparation des données pour l'API
        const eventData = {
            name,
            description,
            date: eventDate.toISOString(),
            location,
            capacity: parseInt(capacity),
            price: price ? parseFloat(price) : 0,
            imageUrl: imageUrl || null,
            currentParticipants: 0
        };

        // Envoi de la requête
        const response = await fetch(`${API_BASE_URL}/api/Events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: 'Erreur lors de la création de l\'événement'
            }));
            throw new Error(errorData.message || `Erreur lors de la création de l'événement (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est en cours d\'exécution sur http://localhost:5034');
        }
        throw error;
    }
};

// Mettre à jour un événement
export const updateEvent = async (id, eventData) => {
    try {
        // Validation des données
        if (!eventData.name?.trim()) {
            throw new Error('Le nom de l\'événement est requis');
        }
        if (!eventData.description?.trim()) {
            throw new Error('La description est requise');
        }
        if (!eventData.date) {
            throw new Error('La date est requise');
        }
        if (!eventData.location?.trim()) {
            throw new Error('Le lieu est requis');
        }
        if (!eventData.maxParticipants || eventData.maxParticipants <= 0) {
            throw new Error('Le nombre maximum de participants doit être supérieur à 0');
        }

        const formattedData = {
            id: parseInt(id),
            name: eventData.name.trim(),
            description: eventData.description.trim(),
            date: new Date(eventData.date).toISOString(),
            location: eventData.location.trim(),
            capacity: parseInt(eventData.maxParticipants),
            price: parseFloat(eventData.price) || 0,
            imageUrl: eventData.imageUrl || null,
            category: eventData.category || null,
            isOnline: eventData.isOnline || false,
            onlineMeetingLink: eventData.onlineMeetingLink || null,
            requirements: eventData.requirements || null,
            contactEmail: eventData.contactEmail || null,
            contactPhone: eventData.contactPhone || null
        };

        console.log('Envoi des données de mise à jour:', formattedData);

        const token = localStorage.getItem('token'); // ou 'authToken' selon ton app

        const response = await fetch(`${API_BASE_URL}/api/Events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(formattedData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                message: 'Erreur lors de la mise à jour de l\'événement'
            }));
            console.error('Erreur de réponse:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });
            throw new Error(errorData.message || `Erreur lors de la mise à jour de l'événement (${response.status})`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'événement ${id}:`, error);
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est en cours d\'exécution sur http://localhost:5034');
        }
        throw error;
    }
};

// Supprimer un événement
export const deleteEvent = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'événement ${id}:`, error);
        throw error;
    }
};

// Rechercher des événements
export const searchEvents = async (query) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la recherche d\'événements:', error);
        throw error;
    }
};

// Récupérer les événements à venir
export const getUpcomingEvents = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/upcoming`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des événements à venir:', error);
        throw error;
    }
};

// Récupérer les événements passés
export const getPastEvents = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/past`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des événements passés:', error);
        throw error;
    }
};

// Récupérer les catégories d'événements
export const getEventCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/categories`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        throw error;
    }
};

// Récupérer tous les événements actifs
export const getActiveEvents = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/Events/active`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur lors de la récupération des événements actifs:', error);
        throw error;
    }
};