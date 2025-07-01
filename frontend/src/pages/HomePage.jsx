import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaTicketAlt, FaMapMarkerAlt, FaClock, FaSearch, FaShoppingCart } from 'react-icons/fa';
import './HomePage.css';
import { getEvents } from '../services/eventService';
import { API_BASE_URL } from '../config';

const HomePage = () => {
    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>
                            <span className="welcome-text">Bienvenue sur</span>
                            <span className="brand-text">SmartEvents</span>
                        </h1>
                        <p className="subtitle">Découvrez, participez et vivez les meilleurs événements près de chez vous</p>
                        <div className="hero-buttons">
                            <Link to="/events" className="cta-button primary">
                                <FaCalendarAlt className="button-icon" />
                                Explorer les Événements
                            </Link>
                            <Link to="/events/create" className="cta-button secondary">
                                <FaTicketAlt className="button-icon" />
                                Créer un Événement
                            </Link>
                        </div>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <FaUsers className="stat-icon" />
                            <span className="stat-number">1000+</span>
                            <span className="stat-label">Participants</span>
                        </div>
                        <div className="stat-item">
                            <FaCalendarAlt className="stat-icon" />
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Événements</span>
                        </div>
                        <div className="stat-item">
                            <FaMapMarkerAlt className="stat-icon" />
                            <span className="stat-number">10+</span>
                            <span className="stat-label">Villes</span>
                        </div>
                        <div className="stat-item">
                            <FaShoppingCart className="stat-icon" />
                            <span className="stat-number">200+</span>
                            <span className="stat-label">Billets dans le panier</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Pourquoi choisir SmartEvents ?</h2>
                <div className="feature-grid" style={{ gap: '1rem', padding: '0 1rem' }}>
                    <div className="feature-card" style={{ padding: '1rem' }}>
                        <div className="feature-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            <FaCalendarAlt />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Événements variés</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Conférences, ateliers, rencontres culturelles et bien plus encore. Une large sélection d'événements pour tous les goûts.</p>
                    </div>
                    <div className="feature-card" style={{ padding: '1rem' }}>
                        <div className="feature-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            <FaTicketAlt />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Inscription rapide</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Inscrivez-vous en quelques clics seulement, sans tracas. Une expérience utilisateur fluide et intuitive.</p>
                    </div>
                    <div className="feature-card" style={{ padding: '1rem' }}>
                        <div className="feature-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            <FaUsers />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Gestion simplifiée</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Organisez et suivez vos événements en toute simplicité. Des outils puissants pour une gestion efficace.</p>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Comment ça marche ?</h2>
                <div className="steps-container" style={{ gap: '1rem', padding: '0 1rem' }}>
                    <div className="step" style={{ padding: '1rem' }}>
                        <div className="step-number" style={{ fontSize: '1.2rem', width: '2rem', height: '2rem' }}>1</div>
                        <div className="step-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            <FaSearch />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Découvrez</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Parcourez notre catalogue d'événements et trouvez celui qui vous correspond</p>
                    </div>
                    <div className="step" style={{ padding: '1rem' }}>
                        <div className="step-number" style={{ fontSize: '1.2rem', width: '2rem', height: '2rem' }}>2</div>
                        <div className="step-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            <FaTicketAlt />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Participez</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Inscrivez-vous en quelques clics et recevez votre confirmation</p>
                    </div>
                    <div className="step" style={{ padding: '1rem' }}>
                        <div className="step-number" style={{ fontSize: '1.2rem', width: '2rem', height: '2rem' }}>3</div>
                        <div className="step-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            <FaClock />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Vivez</h3>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>Participez à l'événement et créez des souvenirs inoubliables</p>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>Prêt à participer ?</h2>
                    <p>Rejoignez notre communauté et découvrez des événements passionnants</p>
                    <div className="cta-buttons">
                        <Link to="/events" className="cta-button primary">
                            <FaCalendarAlt className="button-icon" />
                            Explorer les événements
                        </Link>
                        <Link to="/events/create" className="cta-button secondary">
                            <FaTicketAlt className="button-icon" />
                            Créer un événement
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
