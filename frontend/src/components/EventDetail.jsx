import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEuroSign, FaEdit, FaListAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import { getEventById } from '../services/eventService';
import { formatDate, formatTimeOnly, isDatePast, isDateFuture, getDaysUntil } from '../utils/dateUtils';
import './EventDetail.css';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventById(id);
                setEvent(data);
                setError(null);
            } catch (err) {
                setError('Impossible de charger les détails de l\'événement. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="event-detail">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Chargement des détails de l'événement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="event-detail">
                <div className="error-message">
                    <FaInfoCircle className="error-icon" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="event-detail">
                <div className="error-message">
                    <FaInfoCircle className="error-icon" />
                    <p>Événement non trouvé</p>
                </div>
            </div>
        );
    }

    const isEventFull = event.registrations?.length >= event.capacity;
    const remainingSpots = event.capacity - (event.registrations?.length || 0);
    const registrationStatus = isEventFull ? 'Complet' : `${remainingSpots} places restantes`;

    return (
        <div className="event-detail">
            <div className="event-header">
                <div className="event-title-section">
                    <h1>{event.name}</h1>
                    <div className="event-meta">
                        <div className="meta-item">
                            <FaCalendarAlt className="meta-icon" />
                            <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="meta-item">
                            <FaClock className="meta-icon" />
                            <span>{formatTimeOnly(event.date)}</span>
                        </div>
                        <div className="meta-item">
                            <FaMapMarkerAlt className="meta-icon" />
                            <span>{event.location}</span>
                        </div>
                        <div className="meta-item">
                            <FaUsers className="meta-icon" />
                            <span>{registrationStatus}</span>
                        </div>
                        {event.price > 0 && (
                            <div className="meta-item price">
                                <FaEuroSign className="meta-icon" />
                                <span>{event.price.toFixed(2)} MAD</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="event-actions">
                    <button 
                        className="edit-button"
                        onClick={() => navigate(`/events/${event.id}/edit`)}
                    >
                        <FaEdit /> Modifier l'événement
                    </button>
                    <button 
                        className="registrations-button"
                        onClick={() => navigate(`/events/${event.id}/registrations`)}
                    >
                        <FaListAlt /> Voir les inscriptions
                    </button>
                </div>
            </div>

            <div className="event-content">
                {event.imageUrl && (
                    <div className="event-image">
                        <img src={event.imageUrl} alt={event.name} />
                    </div>
                )}

                <div className="event-description">
                    <h2>À propos de l'événement</h2>
                    <p>{event.description}</p>
                </div>

                <div className="event-sections">
                    <div className="registration-section">
                        <h2>Inscriptions</h2>
                        <div className="registration-info">
                            <div className="info-item">
                                <span className="info-label">Capacité totale :</span>
                                <span className="info-value">{event.capacity} participants</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Inscriptions actuelles :</span>
                                <span className="info-value">{event.registrations?.length || 0} participants</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Statut :</span>
                                <span className={`info-value status ${isEventFull ? 'full' : 'available'}`}>
                                    {registrationStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="participants-section">
                        <h2>Participants</h2>
                        {event.registrations && event.registrations.length > 0 ? (
                            <div className="participants-list">
                                {event.registrations.map((registration) => (
                                    <div key={registration.id} className="participant-item">
                                        <div className="participant-info">
                                            <span className="participant-name">{registration.userId}</span>
                                            <span className="registration-date">
                                                Inscrit le {formatDate(registration.registrationDate)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="no-participants">Aucun participant inscrit pour le moment</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;