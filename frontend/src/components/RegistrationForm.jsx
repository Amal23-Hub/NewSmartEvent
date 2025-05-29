import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RegistrationForm.css';

const RegistrationForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:5034/api/Events/${id}`);
                if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
                const data = await response.json();
                setEvent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !event) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        const registration = {
            eventId: event.id,
            userId: userId,
            registrationDate: new Date().toISOString(),
        };

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:5034/api/Registrations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registration),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate(`/events/${id}`), 2000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'inscription");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Chargement de l'événement...</div>;
    if (error) return <div className="error">Erreur: {error}</div>;

    return (
        <div className="registration-form-container">
            <h1 className="form-title">Inscription à l'événement</h1>

            {event && (
                <div className="event-info">
                    <h2>{event.name}</h2>
                    {event.description && (
                        <p className="event-description">{event.description}</p>
                    )}
                </div>
            )}

            {success ? (
                <div className="success-message">
                    Inscription réussie ! Vous allez être redirigé...
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="registration-form">
                    <div className="form-group">
                        <label htmlFor="userId">ID de l'utilisateur</label>
                        <input
                            type="text"
                            id="userId"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Entrez votre ID utilisateur"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Nom de l'événement</label>
                        <input
                            type="text"
                            value={event?.name || ''}
                            readOnly
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'En cours...' : 'S\'inscrire'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default RegistrationForm;
