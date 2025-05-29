import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventRegistrations } from '../services/registrationService';
import { getEventById } from '../services/eventService';
import './RegistrationsPage.css';

const RegistrationsPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Récupérer les détails de l'événement
                const eventData = await getEventById(eventId);
                setEvent(eventData);

                // Récupérer les inscriptions
                const registrationsData = await getEventRegistrations(eventId);
                setRegistrations(registrationsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!event) {
        return <div className="error-message">Événement non trouvé</div>;
    }

    return (
        <div className="registrations-page">
            <div className="event-header">
                <h1>Inscriptions pour : {event.name}</h1>
                <div className="event-info">
                    <p>Date : {new Date(event.date).toLocaleDateString()}</p>
                    <p>Lieu : {event.location}</p>
                    <p>Capacité : {event.capacity} participants</p>
                    <p>Inscriptions : {registrations.length} / {event.capacity}</p>
                </div>
            </div>

            <div className="registrations-list">
                <h2>Liste des participants</h2>
                {registrations.length === 0 ? (
                    <p className="no-registrations">Aucune inscription pour le moment</p>
                ) : (
                    <table className="registrations-table">
                        <thead>
                            <tr>
                                <th>ID Utilisateur</th>
                                <th>Date d'inscription</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((registration) => (
                                <tr key={registration.id}>
                                    <td>{registration.userId}</td>
                                    <td>{new Date(registration.registrationDate).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RegistrationsPage; 