import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <FaCalendarAlt className="footer-logo-icon" />
                            <span>SmartEvents</span>
                        </Link>
                        <p className="footer-description">
                            Votre plateforme de gestion d'événements premium. Organisez, gérez et partagez vos événements en toute simplicité.
                        </p>
                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-section">
                            <h3>Navigation</h3>
                            <ul>
                                <li><Link to="/">Accueil</Link></li>
                                <li><Link to="/events">Événements</Link></li>
                                <li><Link to="/events/create">Créer un événement</Link></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h3>Contact</h3>
                            <ul className="contact-info">
                                <li>
                                    <FaEnvelope />
                                    <a href="mailto:contact@smartevent.ma">contact@smartevent.ma</a>
                                </li>
                                <li>
                                    <FaPhone />
                                    <a href="tel:+212612345678">+212 6 12 34 56 78</a>
                                </li>
                                <li>
                                    <FaMapMarkerAlt />
                                    <span>Casablanca, Maroc</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} SmartEvents. Tous droits réservés.</p>
                    <div className="footer-legal">
                        <Link to="/mentions-legales">Mentions légales</Link>
                        <Link to="/confidentialite">Politique de confidentialité</Link>
                        <Link to="/conditions">Conditions d'utilisation</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 