import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';
import EventForm from '../components/EventForm';
import { toast } from 'react-toastify';
import './CreateEventPage.css';

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            // Vérification des données requises
            const name = formData.get('name')?.trim();
            const description = formData.get('description')?.trim();
            const date = formData.get('date');
            const location = formData.get('location')?.trim();
            const capacity = formData.get('capacity');

            if (!name) {
                throw new Error('Le nom de l\'événement est requis');
            }

            if (!description) {
                throw new Error('La description est requise');
            }

            if (!date) {
                throw new Error('La date est requise');
            }

            if (!location) {
                throw new Error('Le lieu est requis');
            }

            if (!capacity || isNaN(parseInt(capacity)) || parseInt(capacity) <= 0) {
                throw new Error('Le nombre de participants doit être un nombre positif');
            }

            // Création de l'événement
            const result = await createEvent(formData);
            
            // Succès
            toast.success("L'événement a été créé avec succès");
            navigate('/events', { 
                state: { 
                    message: "L'événement a été créé avec succès",
                    eventId: result.id 
                } 
            });
        } catch (err) {
            console.error("Erreur lors de la création de l'événement:", err);
            const errorMessage = err.message || "Une erreur est survenue lors de la création de l'événement";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-event-page">
            <div className="create-event-container">
                <h1>Nouvel événement</h1>
                {error && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}
                <EventForm 
                    onSubmit={handleSubmit} 
                    loading={loading}
                    mode="create"
                />
            </div>
        </div>
    );
};

export default CreateEventPage;
