import axios from 'axios';

export const downloadTicket = async (eventId) => {
    try {
        const response = await axios.get(`/api/tickets/${eventId}/download`, {
            responseType: 'blob' // Pour recevoir le fichier PDF
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors du téléchargement du ticket:', error);
        throw error;
    }
};
