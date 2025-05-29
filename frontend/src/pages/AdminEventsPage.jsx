import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent } from '../services/eventService';
import LoadingSpinner from './LoadingSpinner';

const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet événement ?')) {
            await deleteEvent(id);
            setEvents(events.filter(event => event.id !== id));
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="admin-events">
            <h1>Gestion des événements</h1>
            <Link to="/admin/events/new" className="btn-add">
                Créer un événement
            </Link>

            <div className="events-grid">
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        <h3>{event.title}</h3>
                        <p>{new Date(event.date).toLocaleDateString()}</p>
                        <div className="actions">
                            <button onClick={() => navigate(`/admin/events/edit/${event.id}`)}>
                                Éditer
                            </button>
                            <button onClick={() => handleDelete(event.id)} className="delete">
                                Supprimer
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminEventsPage;