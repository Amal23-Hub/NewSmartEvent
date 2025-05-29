import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { MESSAGES } from '../config';
import './EventList.css';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                console.log('Chargement des événements...');
                const data = await getEvents();
                console.log('Événements reçus:', data);
                setEvents(data);
            } catch (err) {
                console.error('Erreur lors du chargement des événements:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div className="loading">{MESSAGES.LOADING}</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (events.length === 0) return <div className="no-events">{MESSAGES.NO_EVENTS}</div>;

    return (
        <div className="event-list">
            <h2>Découvrez les prochains événements à ne pas manquer</h2>
            <div className="events-grid">
                {events.map((event) => (
                    <div className="event-card" key={event.id}>
                        {event.imageUrl && (
                            <div className="event-image">
                                <img src={event.imageUrl} alt={event.name} />
                            </div>
                        )}
                        <div className="event-content">
                            <h3>{event.name}</h3>
                            <p className="event-date">
                                <strong>Date :</strong> {new Date(event.date).toLocaleString()}
                            </p>
                            <p className="event-location">
                                <strong>Lieu :</strong> {event.location}
                            </p> <br/>
                            <p className="event-description">
                                {event.description || "Aucune description disponible."}
                            </p>
                            <div className="event-meta">
                                {event.capacity > 0 && (
                                    <span className="event-capacity">
                                        Places disponibles : {event.capacity}
                                    </span>
                                )}
                                {event.price > 0 && (
                                    <span className="event-price">
                                        Prix : {event.price}€
                                    </span>
                                )}
                            </div>
                            <Link to={`/events/${event.id}`} className="event-detail-link">
                                Voir les détails
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventList;
