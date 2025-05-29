import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaHome, FaUsers, FaBars, FaTimes, FaList } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container navbar-container">
                <img
                    src="/assets/image.png"
                    alt="Logo SmartEvent"
                    className="navbar-logo"
                />
                
                

                <button 
                    className="mobile-menu-button"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menu"
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`navbar-menu ${isMobileMenuOpen ? 'is-active' : ''}`}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        aria-label="Accueil"
                    >
                        <FaHome className="nav-icon" />
                        <span>Accueil</span>
                    </NavLink>

                    <NavLink
                        to="/events"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        aria-label="Événements"
                    >
                        <FaUsers className="nav-icon" />
                        <span>Événements</span>
                    </NavLink>

                    <NavLink
                        to="/participants"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        aria-label="Liste des participants"
                    >
                        <FaList className="nav-icon" />
                        <span>Participants</span>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;