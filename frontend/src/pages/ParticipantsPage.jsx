import React, { useState, useEffect } from 'react';
import { getEvents, getEventParticipants } from '../services/eventService';

const ParticipantsPage = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showStats, setShowStats] = useState(false);

    // Image par défaut pour les événements
    const defaultEventImage = 'https://img.freepik.com/free-vector/abstract-geometric-pattern-background_1319-242.jpg';

    // Calculer les statistiques
    const stats = {
        total: participants.length,
        today: participants.filter(p => {
            const today = new Date();
            const regDate = new Date(p.registrationDate);
            return regDate.toDateString() === today.toDateString();
        }).length,
        thisWeek: participants.filter(p => {
            const today = new Date();
            const regDate = new Date(p.registrationDate);
            const diffTime = Math.abs(today - regDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
        }).length
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const data = await getEvents();
                // Ajouter l'image par défaut si imageUrl n'existe pas
                const eventsWithImages = data.map(event => ({
                    ...event,
                    image: event.imageUrl || defaultEventImage
                }));
                setEvents(eventsWithImages);
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

    const selectedEventData = events.find(event => event.id === selectedEvent);
    console.log('Selected event data:', selectedEventData);

    return (
        <div style={{
            maxWidth: 800,
            margin: '2rem auto',
            padding: '2rem',
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                borderBottom: '2px solid #3498db',
                paddingBottom: '0.5rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid #3498db',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {selectedEventData ? (
                            <img 
                                src={selectedEventData.imageUrl || defaultEventImage} 
                                alt={selectedEventData.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                onError={(e) => {
                                    e.target.src = defaultEventImage;
                                }}
                            />
                        ) : (
                            <span style={{ fontSize: '2rem' }}>🎉</span>
                        )}
                    </div>
                    <h2 style={{
                        color: '#2c3e50',
                        fontSize: '1.8rem',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '1.8rem' }}>👥</span>
                        Liste des participants
                    </h2>
                </div>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={() => setShowStats(!showStats)}
                        style={{
                            background: showStats ? '#3498db' : '#f8fafc',
                            color: showStats ? 'white' : '#3498db',
                            border: '2px solid #3498db',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>📊</span>
                        {showStats ? 'Masquer les stats' : 'Voir les stats'}
                    </button>
                    <div style={{
                        background: '#3498db',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '1rem',
                        fontWeight: 500
                    }}>
                        {participants.length} participant{participants.length > 1 ? 's' : ''}
                    </div>
                </div>
            </div>
            
            {showStats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: 8
                }}>
                    <div style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: 8,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', color: '#3498db', marginBottom: '0.5rem' }}>👥</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{stats.total}</div>
                        <div style={{ color: '#718096' }}>Total</div>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: 8,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', color: '#3498db', marginBottom: '0.5rem' }}>📅</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{stats.today}</div>
                        <div style={{ color: '#718096' }}>Aujourd'hui</div>
                    </div>
                    <div style={{
                        background: 'white',
                        padding: '1rem',
                        borderRadius: 8,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', color: '#3498db', marginBottom: '0.5rem' }}>📊</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>{stats.thisWeek}</div>
                        <div style={{ color: '#718096' }}>Cette semaine</div>
                    </div>
                </div>
            )}

            {error && (
                <div style={{
                    color: '#e74c3c',
                    padding: '0.8rem',
                    background: '#fde8e8',
                    borderRadius: 6,
                    marginBottom: '1rem'
                }}>{error}</div>
            )}

            {selectedEventData && selectedEventData.imageUrl && (
                <div style={{
                    marginBottom: '2rem',
                    borderRadius: 8,
                    overflow: 'hidden',
                    height: '200px',
                    position: 'relative'
                }}>
                    <img 
                        src={selectedEventData.imageUrl} 
                        alt={selectedEventData.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        padding: '1rem',
                        color: 'white'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedEventData.name}</h3>
                        <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            {new Date(selectedEventData.date).toLocaleDateString('fr-FR')}
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                marginBottom: '2rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: 8
            }}>
                <label htmlFor="event-select" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#4a5568',
                    fontWeight: 500
                }}>Sélectionner un événement :</label>
                <select
                    id="event-select"
                    value={selectedEvent || ''}
                    onChange={e => setSelectedEvent(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: 6,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#fff',
                        fontSize: '1rem',
                        color: '#2d3748'
                    }}
                >
                    {events.map(event => (
                        <option key={event.id} value={event.id}>
                            {event.name} - {new Date(event.date).toLocaleDateString('fr-FR')}
                        </option>
                    ))}
                </select>

                <div style={{
                    marginTop: '1rem',
                    display: 'grid',
                    gap: '0.5rem'
                }}>
                    {events.map(event => (
                        <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem',
                                background: selectedEvent === event.id ? '#e2e8f0' : '#fff',
                                borderRadius: 6,
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    background: '#f8fafc'
                                }
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                background: '#f0f0f0',
                                flexShrink: 0
                            }}>
                                <img 
                                    src={event.imageUrl || defaultEventImage} 
                                    alt={event.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.src = defaultEventImage;
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#2c3e50'
                                }}>{event.name}</div>
                                <div style={{
                                    color: '#718096',
                                    fontSize: '0.9rem'
                                }}>
                                    {new Date(event.date).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#718096'
                }}>Chargement...</div>
            ) : participants.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gap: '0.75rem'
                }}>
                    {participants.map((p, idx) => (
                        <div key={idx} style={{
                            padding: '0.75rem',
                            background: '#fff',
                            borderRadius: 6,
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            animation: `slideIn 0.5s ease-out ${idx * 0.1}s both`,
                            '@keyframes slideIn': {
                                '0%': {
                                    opacity: 0,
                                    transform: 'translateY(20px)'
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'translateY(0)'
                                }
                            },
                            ':hover': {
                                background: '#f8fafc',
                                transform: 'translateX(10px)',
                                borderColor: '#3498db'
                            }
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#3498db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                transition: 'transform 0.3s ease',
                                ':hover': {
                                    transform: 'scale(1.1)'
                                }
                            }}>
                                {p.email.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#2c3e50',
                                    fontSize: '0.85rem',
                                    marginBottom: '0.15rem',
                                    transition: 'color 0.3s ease'
                                }}>
                                    {p.email}
                                </div>
                                <div style={{
                                    color: '#718096',
                                    fontSize: '0.75rem',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Inscrit le {p.registrationDate ? new Date(p.registrationDate).toLocaleDateString('fr-FR') : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#718096',
                    background: '#f8fafc',
                    borderRadius: 8
                }}>Aucun participant pour cet événement.</div>
            )}
        </div>
    );
};

export default ParticipantsPage; 