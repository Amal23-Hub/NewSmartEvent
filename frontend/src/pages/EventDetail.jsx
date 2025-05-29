import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEuroSign, FaEdit, FaTrash, FaArrowLeft, FaRegClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import './EventDetail.css';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [registrationData, setRegistrationData] = useState({
        email: ''
    });

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5034/api/Events/${id}`);
            setEvent(response.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des détails de l\'événement');
            navigate('/events');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
            return;
        }

        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:5034/api/Events/${id}`);
            toast.success('Événement supprimé avec succès');
            navigate('/events');
        } catch (error) {
            toast.error('Erreur lors de la suppression de l\'événement');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRegistrationChange = (e) => {
        const { name, value } = e.target;
        setRegistrationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registrationData.email)) {
            toast.error('Veuillez entrer une adresse email valide');
            return;
        }

        setIsRegistering(true);
        try {
            console.log('Tentative de participation avec:', { 
                eventId: parseInt(id), 
                email: registrationData.email 
            });
            
            const response = await axios.post(
                `http://localhost:5034/api/Registrations/direct`,
                {
                    eventId: parseInt(id),
                    email: registrationData.email
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            console.log('Réponse du serveur:', response.data);

            if (response.data) {
                setShowRegistrationForm(false);
                setRegistrationData({ email: '' }); // Réinitialiser le formulaire
                toast.success('Super ! Vous participez à l\'événement !');
                fetchEventDetails();
            }
        } catch (error) {
            console.error('Erreur complète:', error);
            console.error('Détails de la réponse:', error.response?.data);
            console.error('Status de la réponse:', error.response?.status);
            console.error('Headers de la réponse:', error.response?.headers);
            
            if (error.response?.status === 400) {
                toast.error(error.response.data.message || 'Email invalide ou déjà utilisé');
            } else if (error.response?.status === 404) {
                toast.error('Événement non trouvé');
            } else if (error.response?.status === 409) {
                toast.error('Vous participez déjà à cet événement');
            } else if (error.response?.status === 500) {
                toast.error('Erreur serveur. Veuillez réessayer plus tard.');
            } else if (!error.response) {
                toast.error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
            } else {
                toast.error(`Erreur lors de la participation: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setIsRegistering(false);
        }
    };

    if (isLoading) {
        return (
            <div className="event-detail-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!event) {
        return null;
    }

    const isPast = new Date(event.date) < new Date();
    const isFull = event.currentParticipants >= event.maxParticipants;
    const canRegister = !isPast && !isFull;

    return (
        <div className="event-detail-page">
            <div className="event-detail-container">
                <div className="event-detail-header">
                    <Link to="/events" className="back-button">
                        <FaArrowLeft /> Retour aux événements
                    </Link>
                    <div className="event-actions">
                        <Link to={`/events/${id}/edit`} className="edit-button">
                            <FaEdit /> Modifier
                        </Link>
                        <button 
                            onClick={handleDelete} 
                            className="delete-button"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Suppression...' : <><FaTrash /> Supprimer</>}
                        </button>
                    </div>
                </div>

                <div className="event-detail-content">
                    <div className="event-image-container">
                        <img 
                            src={event.imageUrl || '/images/default-event.jpg'} 
                            alt={event.name}
                            className="event-image"
                        />
                        {isPast && <div className="event-status past">Terminé</div>}
                        {isFull && !isPast && <div className="event-status full">Complet</div>}
                    </div>

                    <div className="event-info">
                        <h1 className="event-title">{event.name}</h1>
                        
                        <div className="event-meta">
                            <div className="meta-item">
                                <FaCalendarAlt className="meta-icon" />
                                <span>{new Date(event.date).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                            <div className="meta-item">
                                <FaMapMarkerAlt className="meta-icon" />
                                <span>{event.location}</span>
                            </div>
                            <div className="meta-item">
                                <FaUsers className="meta-icon" />
                                <span>{event.currentParticipants} / {event.maxParticipants} participants</span>
                            </div>
                            <div className="meta-item">
                                <FaEuroSign className="meta-icon" />
                                <span>{event.price} MAD par personne</span>
                            </div>
                        </div>

                        <div className="event-description">
                            <h2>Description</h2>
                            <p>{event.description}</p>
                        </div>

                        <div className="event-registration">
                            {canRegister ? (
                                showRegistrationForm ? (
                                    <div className="quick-registration">
                                        <form onSubmit={handleRegister} className="registration-form quick">
                                            <h3>Je participe !</h3>
                                            <p className="registration-subtitle">Entrez votre email pour participer à l'événement</p>
                                            
                                            <div className="form-group">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={registrationData.email}
                                                    onChange={handleRegistrationChange}
                                                    placeholder="Votre email"
                                                    required
                                                    className="quick-input"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="quick-register-button"
                                                disabled={isRegistering}
                                            >
                                                {isRegistering ? (
                                                    <span className="loading-spinner"></span>
                                                ) : (
                                                    'Je participe !'
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => setShowRegistrationForm(true)}
                                        className="quick-start-button"
                                    >
                                        Je participe !
                                    </button>
                                )
                            ) : isPast ? (
                                <div className="registration-status past">
                                    Cet événement est terminé
                                </div>
                            ) : (
                                <div className="registration-status full">
                                    Complet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail; 