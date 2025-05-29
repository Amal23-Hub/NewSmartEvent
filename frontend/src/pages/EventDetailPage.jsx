import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import ParticipantsList from '../components/ParticipantsList';
import './EventDetailPage.css';

const EventDetailPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const data = await getEventById(id);
                setEvent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return (
        <div className="event-detail loading">
            <div className="loading-spinner"></div>
            <p>Chargement de l'événement...</p>
        </div>
    );

    if (error) return (
        <div className="event-detail error">
            <p>Erreur : {error}</p>
        </div>
    );

    if (!event) return null;

    return (
        <div className="event-detail">
            <div className="event-header">
                {event.imageUrl && (
                    <div className="event-image">
                        <img src={event.imageUrl} alt={event.name} />
                    </div>
                )}
                <div className="event-info">
                    <h1>{event.name}</h1>
                    <div className="event-meta">
                        <div className="meta-item">
                            <i className="fas fa-calendar"></i>
                            <span>{new Date(event.date).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                        <div className="meta-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{event.location}</span>
                        </div>
                        <div className="meta-item">
                            <i className="fas fa-users"></i>
                            <span>{event.currentParticipants || 0} / {event.capacity} participants</span>
                        </div>
                        {event.price > 0 && (
                            <div className="meta-item">
                                <i className="fas fa-ticket-alt"></i>
                                <span>{event.price.toFixed(2)} MAD</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="event-content">
                <div className="event-description">
                    <h2>Description</h2>
                    <p>{event.description || 'Aucune description disponible'}</p>
                </div>

                <div className="event-participants">
                    <h2>Participants</h2>
                    <ParticipantsList eventId={id} />
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
