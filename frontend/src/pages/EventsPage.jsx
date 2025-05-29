import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPlus, FaSearch, FaArrowRight, FaUserPlus, FaFilter, FaTicketAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getEvents } from '../services/eventService';
import { registerToEvent } from '../services/registrationService';
import { formatDate, formatDateOnly, isDatePast } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';
import './EventsPage.css';
import axios from 'axios';

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [registering, setRegistering] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        date: '',
        city: '',
        category: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await getEvents();
            setEvents(data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des événements');
            toast.error('Erreur lors du chargement des événements');
        } finally {
            setLoading(false);
        }
    };

    const handleBuyTicket = (eventId) => {
        // Rediriger vers la page de paiement avec l'ID de l'événement
        navigate(`/payment/${eventId}`);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            date: '',
            city: '',
            category: ''
        });
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = 
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDate = !filters.date || new Date(event.date).toDateString() === new Date(filters.date).toDateString();
        const matchesCity = !filters.city || event.location.toLowerCase().includes(filters.city.toLowerCase());
        const matchesCategory = !filters.category || event.category === filters.category;

        return matchesSearch && matchesDate && matchesCity && matchesCategory;
    });

    if (loading) return <LoadingSpinner message="Chargement des événements..." />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="events-page">
            <div className="events-header">
                <div className="header-content">
                    <h1>Événements à venir</h1>
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher un événement..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button 
                            className="filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            Filtres
                        </button>
                    </div>
                </div>
                <Link to="/events/create" className="create-event-button">
                    <FaPlus /> Créer un événement
                </Link>
            </div>

            {showFilters && (
                <div className="filters-section">
                    <div className="filter-group">
                        <label>
                            <FaCalendarAlt /> Date
                            <input
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleFilterChange}
                            />
                        </label>
                        <label>
                            <FaMapMarkerAlt /> Ville
                            <input
                                type="text"
                                name="city"
                                placeholder="Filtrer par ville..."
                                value={filters.city}
                                onChange={handleFilterChange}
                            />
                        </label>
                        <label>
                            Catégorie
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                            >
                                <option value="">Toutes les catégories</option>
                                <option value="Conference">Conférence</option>
                                <option value="Workshop">Atelier</option>
                                <option value="Concert">Concert</option>
                                <option value="Exhibition">Exposition</option>
                                <option value="Sport">Sport</option>
                                <option value="Other">Autre</option>
                            </select>
                        </label>
                        <button className="clear-filters" onClick={clearFilters}>
                            Effacer les filtres
                        </button>
                    </div>
                </div>
            )}

            {filteredEvents.length === 0 ? (
                <div className="no-events">
                    <p>Aucun événement trouvé</p>
                </div>
            ) : (
                <div className="events-grid">
                    {filteredEvents.map(event => {
                        const isParticipating = event.registrations?.some(reg => reg.userId === localStorage.getItem('userId'));
                        const isFull = event.registrations?.length >= event.capacity;
                        const isPast = isDatePast(event.date);
                        const cardClass = `event-card${!event.imageUrl ? ' no-image' : ''}`;
                        
                        return (
                            <div key={event.id} className={cardClass}>
                                {event.imageUrl && (
                                    <div className="event-image">
                                        <img src={event.imageUrl} alt={event.name} />
                                        {isPast && (
                                            <div className="event-status past">
                                                Événement terminé
                                            </div>
                                        )}
                                        {isFull && !isPast && (
                                            <div className="event-status full">
                                                Complet
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="event-content">
                                    <h2 className="event-title">{event.name}</h2>
                                    <div className="event-meta">
                                        <div className="meta-row">
                                            <span className="meta-item">
                                                <FaCalendarAlt className="meta-icon" />
                                                {formatDateOnly(event.date)}
                                            </span>
                                            <span className="meta-item">
                                                <FaMapMarkerAlt className="meta-icon" />
                                                {event.location}
                                            </span>
                                        </div>
                                        <div className="meta-row">
                                            <span className="meta-item">
                                                <FaUsers className="meta-icon" />
                                                {event.registrations?.length || 0} / {event.capacity} participants
                                            </span>
                                        </div>
                                    </div>
                                    <p className="event-description">{event.description}</p>
                                    <div className="event-footer">
                                        <div className="event-price">{event.price > 0 ? `${event.price.toFixed(2)} MAD` : 'Gratuit'}</div>
                                        <Link to={`/events/${event.id}`} className="view-details-button">
                                            Voir Détails <FaArrowRight className="button-icon" />
                                        </Link>
                                        {!isPast && event.price > 0 && (
                                            <button 
                                                onClick={() => handleBuyTicket(event.id)}
                                                className="buy-ticket-button"
                                            >
                                                <FaTicketAlt style={{marginRight: '0.3em'}} /> Acheter ticket
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EventsPage;
