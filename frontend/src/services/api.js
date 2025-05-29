// Configuration de l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5034/api';

// Gestion du token d'authentification
const getAuthToken = () => localStorage.getItem('authToken');

// Fonction pour gérer les erreurs de manière cohérente
const handleApiError = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Une erreur est survenue' }));
        throw new Error(error.message || `Erreur ${response.status}: ${response.statusText}`);
    }
    return response;
};

export const fetchApi = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        await handleApiError(response);
        return response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Fonctions utilitaires pour les méthodes HTTP courantes
export const api = {
    get: (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, data, options = {}) => fetchApi(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data),
    }),
    put: (endpoint, data, options = {}) => fetchApi(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'DELETE' }),
};