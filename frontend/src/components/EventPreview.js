import React from 'react';
import './EventPreview.css';

const EventPreview = ({ event }) => {
  const isSoldOut = event.maxParticipants && event.maxParticipants <= event.participants?.length;
  const remainingSpots = event.maxParticipants ? event.maxParticipants - (event.participants?.length || 0) : 0;

  return (
    <div className={`event-preview ${isSoldOut ? 'sold-out' : ''}`}>
      <div className="event-preview-header">
        <div className="event-preview-image">
          <img src={event.image} alt={event.title} />
        </div>
        <div className="event-preview-info">
          <h2>{event.title}</h2>
          <div className="event-meta">
            <div className="event-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span>{event.date}</span>
            </div>
            <div className="event-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-10h4v2h-4v2l-2 2v-4l2-2z" />
              </svg>
              <span>{event.location}</span>
            </div>
            <div className="event-meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              <span>
                {event.participants?.length || 0}/{event.maxParticipants}
                {remainingSpots > 0 && ` (${remainingSpots} places restantes)`}
              </span>
            </div>
          </div>
        </div>
      </div>
      {isSoldOut && (
        <div className="sold-out-overlay">
          <span>SOLD OUT</span>
          <div className="sold-out-details">
            <p>Maximum de participants atteint</p>
            <p>{event.maxParticipants} participants inscrits</p>
            <p>Revenez plus tard pour voir si des places se libèrent</p>
          </div>
        </div>
      )}
      <div className="event-preview-content">
        <div className="event-section">
          <p>{event.description}</p>
        </div>
        <div className="event-details">
          <div className="event-detail-item">
            <h4>Organisateur</h4>
            <p>{event.organizer}</p>
          </div>
          <div className="event-detail-item">
            <h4>Prix</h4>
            <p>{event.price ? `${event.price} €` : 'Gratuit'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;
