    import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateEvent } from '../services/eventService';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEuroSign, FaImage } from 'react-icons/fa';
import './EditEventPage.css';

const EditEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [event, setEvent] = useState({
        name: '',
        description: '',
        date: '',
        location: '',
        maxParticipants: 0,
        price: 0,
        imageUrl: '',
        category: '',
        isOnline: false,
        onlineMeetingLink: '',
        requirements: '',
        contactEmail: '',
        contactPhone: ''
    });

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`http://localhost:5034/api/Events/${id}`);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des détails de l\'événement');
            }
            const eventData = await response.json();
            // Formater la date pour l'input datetime-local
            eventData.date = new Date(eventData.date).toISOString().slice(0, 16);
            setEvent(eventData);
        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            setError(error.message);
            toast.error('Erreur lors du chargement des détails de l\'événement');
            navigate('/events');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEvent(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!event.name.trim()) {
            toast.error('Le nom de l\'événement est requis');
            return false;
        }
        if (!event.description.trim()) {
            toast.error('La description est requise');
            return false;
        }
        if (!event.date) {
            toast.error('La date est requise');
            return false;
        }
        if (!event.location.trim()) {
            toast.error('Le lieu est requis');
            return false;
        }
        if (event.maxParticipants <= 0) {
            toast.error('Le nombre maximum de participants doit être supérieur à 0');
            return false;
        }
        if (event.price < 0) {
            toast.error('Le prix ne peut pas être négatif');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            console.log('Envoi des données de mise à jour:', event);
            await updateEvent(id, event);
            toast.success('Événement mis à jour avec succès');
            navigate('/events');
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            setError(error.message);
            toast.error(error.message || 'Erreur lors de la mise à jour de l\'événement');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="edit-event-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Erreur</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/events')}>Retour aux événements</button>
            </div>
        );
    }

    return (
        <div className="edit-event-page">
            <div className="edit-event-container">
                <h1>Modifier l'événement</h1>
                
                <form onSubmit={handleSubmit} className="edit-event-form">
                    <div className="form-group">
                        <label htmlFor="name">
                            <FaUsers className="input-icon" />
                            Nom de l'événement
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={event.name}
                            onChange={handleChange}
                            placeholder="Nom de l'événement"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={event.description}
                            onChange={handleChange}
                            placeholder="Description de l'événement"
                            required
                            rows="4"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="date">
                                <FaCalendarAlt className="input-icon" />
                                Date et heure
                            </label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                value={event.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">
                                <FaMapMarkerAlt className="input-icon" />
                                Lieu
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={event.location}
                                onChange={handleChange}
                                placeholder="Lieu de l'événement"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="maxParticipants">
                                <FaUsers className="input-icon" />
                                Nombre maximum de participants
                            </label>
                            <input
                                type="number"
                                id="maxParticipants"
                                name="maxParticipants"
                                value={event.maxParticipants}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">
                                <FaEuroSign className="input-icon" />
                                Prix par personne (MAD)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={event.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl">
                            <FaImage className="input-icon" />
                            URL de l'image
                        </label>
                        <input
                            type="url"
                            id="imageUrl"
                            name="imageUrl"
                            value={event.imageUrl}
                            onChange={handleChange}
                            placeholder="URL de l'image de l'événement"
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                name="isOnline"
                                checked={event.isOnline}
                                onChange={handleChange}
                            />
                            Événement en ligne
                        </label>
                    </div>

                    {event.isOnline && (
                        <div className="form-group">
                            <label htmlFor="onlineMeetingLink">Lien de la réunion en ligne</label>
                            <input
                                type="url"
                                id="onlineMeetingLink"
                                name="onlineMeetingLink"
                                value={event.onlineMeetingLink}
                                onChange={handleChange}
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="category">Catégorie</label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={event.category}
                            onChange={handleChange}
                            placeholder="Catégorie de l'événement"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="requirements">Prérequis</label>
                        <textarea
                            id="requirements"
                            name="requirements"
                            value={event.requirements}
                            onChange={handleChange}
                            placeholder="Prérequis pour participer à l'événement"
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="contactEmail">Email de contact</label>
                            <input
                                type="email"
                                id="contactEmail"
                                name="contactEmail"
                                value={event.contactEmail}
                                onChange={handleChange}
                                placeholder="contact@exemple.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contactPhone">Téléphone de contact</label>
                            <input
                                type="tel"
                                id="contactPhone"
                                name="contactPhone"
                                value={event.contactPhone}
                                onChange={handleChange}
                                placeholder="+33 6 12 34 56 78"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => navigate('/events')}
                            disabled={isSubmitting}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Mise à jour...
                                </>
                            ) : (
                                'Mettre à jour l\'événement'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEventPage;