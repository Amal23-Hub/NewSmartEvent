import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import notFoundImage from '../assets/404-illustration.svg';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-content">
                <div className="not-found-image">
                    <img src={notFoundImage} alt="Page non trouvée" />
                </div>
                <div className="not-found-text">
                    <h1>Page non trouvée</h1>
                    <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
                    <Link to="/" className="home-button">
                        <FaHome className="button-icon" />
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage; 