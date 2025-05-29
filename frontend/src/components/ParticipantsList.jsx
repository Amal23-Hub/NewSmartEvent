import React, { useEffect, useState } from 'react';
import { getEventParticipants } from '../services/eventService';
import './ParticipantsList.css';

const ParticipantsList = ({ eventId }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getEventParticipants(eventId);
                setParticipants(data);
            } catch (error) {
                console.error("Erreur lors du chargement des participants:", error);
                setError("Impossible de charger la liste des participants");
            } finally {
                setLoading(false);
            }
        };
        fetchParticipants();
    }, [eventId]);

    if (loading) return (
        <div className="participants-list loading">
            <div className="loading-spinner"></div>
            <p>Chargement des participants...</p>
        </div>
    );

    if (error) return (
        <div className="participants-list error">
            <p>{error}</p>
        </div>
    );

    return (
        <div className="participants-list">
            <h3>Liste des participants ({participants.length})</h3>
            {participants.length > 0 ? (
                <div className="participants-grid">
                    {participants.map((participant) => (
                        <div key={participant.id} className="participant-card">
                            <div className="participant-email">
                                <i className="fas fa-envelope"></i>
                                {participant.email}
                            </div>
                            <div className="participant-date">
                                <i className="fas fa-calendar"></i>
                                {new Date(participant.registrationDate).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-participants">
                    <i className="fas fa-users"></i>
                    <p>Aucun participant pour le moment</p>
                </div>
            )}
        </div>
    );
};

export default ParticipantsList;