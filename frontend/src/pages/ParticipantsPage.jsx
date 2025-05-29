import React, { useState, useEffect } from 'react';
import { getEvents, getEventParticipants } from '../services/eventService';

const ParticipantsPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const data = await getEvents();
                setEvents(data);
                if (data.length > 0) {
                    setSelectedEvent(data[0].id);
                }
            } catch (err) {
                setError('Erreur lors du chargement des événements');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchParticipants = async () => {
            if (!selectedEvent) return;
            setLoading(true);
            try {
                const data = await getEventParticipants(selectedEvent);
                setParticipants(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Erreur lors du chargement des participants');
            } finally {
                setLoading(false);
            }
        };
        fetchParticipants();
    }, [selectedEvent]);

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8 }}>
            <h2>Liste des participants</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="event-select">Sélectionner un événement :</label>
                <select
                    id="event-select"
                    value={selectedEvent || ''}
                    onChange={e => setSelectedEvent(e.target.value)}
                    style={{ marginLeft: 8 }}
                >
                    {events.map(event => (
                        <option key={event.id} value={event.id}>
                            {event.name} - {new Date(event.date).toLocaleDateString('fr-FR')}
                        </option>
                    ))}
                </select>
            </div>
            {loading ? (
                <div>Chargement...</div>
            ) : participants.length > 0 ? (
                <div style={{marginTop: '2rem'}}>
                  {participants.map((p, idx) => (
                    <div key={idx} style={{marginBottom: '1.2em'}}>
                      <div style={{fontWeight: 600, color: '#2c3e50'}}>{p.email}</div>
                      <div style={{color: '#7f8c8d', fontSize: '0.98rem'}}>
                        Inscrit le {p.registrationDate ? new Date(p.registrationDate).toLocaleDateString('fr-FR') : ''}
                      </div>
                    </div>
                  ))}
                </div>
            ) : (
                <div>Aucun participant pour cet événement.</div>
            )}
        </div>
    );
};

export default ParticipantsPage; 