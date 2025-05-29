import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { getEventRegistrations } from '../services/registrationService';
import { formatDate } from '../utils/dateUtils';
import './EventRegistrationsPage.css';

const EventRegistrationsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const data = await getEventRegistrations(id);
                setRegistrations(data);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des inscriptions');
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Chargement des inscriptions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => navigate(-1)} className="back-button">
                    <FaArrowLeft /> Retour
                </button>
            </div>
        );
    }

    return (
        <div className="registrations-page">
            <div className="registrations-header">
                <button onClick={() => navigate(-1)} className="back-button">
                    <FaArrowLeft /> Retour
                </button>
                <h1>Liste des inscriptions</h1>
            </div>

            {registrations.length === 0 ? (
                <div className="no-registrations">
                    <p>Aucune inscription pour cet événement</p>
                </div>
            ) : (
                <div className="registrations-list">
                    {registrations.map((registration) => (
                        <div key={registration.id} className="registration-card">
                            <div className="registration-info">
                                <div className="user-info">
                                    <FaUser className="icon" />
                                    <span>{registration.userId}</span>
                                </div>
                                <div className="registration-date">
                                    <FaCalendarAlt className="icon" />
                                    <span>Inscrit le {formatDate(registration.registrationDate)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventRegistrationsPage; 