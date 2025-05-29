import axios from 'axios';

const API_URL = 'http://localhost:5034/api';

export const registerToEvent = async (eventId, userId) => {
    try {
        const response = await axios.post(`${API_URL}/Registrations`, {
            eventId,
            userId,
            registrationDate: new Date().toISOString()
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription à l\'événement');
    }
};

export const unregisterFromEvent = async (eventId, userId) => {
    try {
        const response = await axios.delete(`${API_URL}/Registrations/${eventId}/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la désinscription de l\'événement');
    }
};

export const getEventRegistrations = async (eventId) => {
    try {
        const response = await axios.get(`${API_URL}/Registrations/${eventId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des inscriptions');
    }
}; 