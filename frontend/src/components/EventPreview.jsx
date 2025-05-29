import React from 'react';
import './EventPreview.css';

const EventPreview = ({ event }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            dateStyle: 'full',
            timeStyle: 'short'
        }).format(date);
    };

    const formatPrice = (price) => {
        if (!price) return 'Gratuit';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    return (
        <div className="event-preview">
            <div className="event-preview-header">
                {event.imageUrl && (
                    <div className="event-preview-image">
                        <img src={event.imageUrl} alt={event.title} />
                    </div>
                )}
                <div className="event-preview-info">
                    <h2>{event.title}</h2>
                    <div className="event-meta">
                        <div className="event-meta-item">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatDate(event.date)}</span>
                            {event.endDate && (
                                <span> - {formatDate(event.endDate)}</span>
                            )}
                        </div>
                        <br/>
                        <div className="event-meta-item">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>
                                {event.isOnline ? (
                                    <span className="online-event">Événement en ligne</span>
                                ) : (
                                    <>
                                        {event.location}
                                        {event.address && `, ${event.address}`}
                                        {event.city && `, ${event.city}`}
                                        {event.postalCode && ` ${event.postalCode}`}
                                    </>
                                )}
                            </span>
                        </div>
                        <br/>
                        <div className="event-meta-item">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>
                                {event.maxParticipants 
                                    ? `${event.maxParticipants} participants maximum`
                                    : 'Nombre de participants illimité'}
                            </span> 
                        </div>
                        <div className="event-meta-item">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatPrice(event.price)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="event-preview-content">
                <section className="event-section">
                    <h3>Description</h3>
                    <p>{event.description}</p>
                </section>

                {event.requirements && (
                    <section className="event-section">
                        <h3>Prérequis</h3>
                        <p>{event.requirements}</p>
                    </section>
                )}

                <section className="event-section">
                    <h3>Informations pratiques</h3>
                    <div className="event-details">
                        {event.isOnline && (
                            <div className="event-detail-item">
                                <h4>Lien de réunion</h4>
                                <a href={event.onlineMeetingLink} target="_blank" rel="noopener noreferrer">
                                    {event.onlineMeetingLink}
                                </a>
                            </div>
                        )}
                        <div className="event-detail-item">
                            <h4>Contact</h4>
                            <p>
                                <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
                                {event.contactPhone && (
                                    <span> • <a href={`tel:${event.contactPhone}`}>{event.contactPhone}</a></span>
                                )}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <div className="event-footer">
                <div className="event-price">
                    {formatPrice(event.price)}
                </div>
                <button className="view-details-button">
                    Voir Détails
                </button>
                <button className="participate-button">
                    Acheter tickets
                </button>
            </div>
        </div>
    );
};

export default EventPreview; 