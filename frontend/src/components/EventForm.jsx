import React, { useState, useEffect } from 'react';
import { createEvent, updateEvent, getEventCategories } from '../services/eventService';
import './EventForm.css';

const EventForm = ({ initialData = {}, onSubmit, loading, mode = 'create', onChange }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || initialData.title || '',
        description: initialData.description || '',
        date: initialData.date || '',
        endDate: initialData.endDate || '',
        location: initialData.location || '',
        address: initialData.address || '',
        city: initialData.city || '',
        postalCode: initialData.postalCode || '',
        category: initialData.category || '',
        maxParticipants: initialData.maxParticipants || initialData.capacity || '',
        price: initialData.price || '',
        imageUrl: initialData.imageUrl || '',
        isOnline: initialData.isOnline || false,
        onlineMeetingLink: initialData.onlineMeetingLink || '',
        requirements: initialData.requirements || '',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || ''
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [imagePreview, setImagePreview] = useState(initialData.imageUrl || null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categoriesData = await getEventCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
            }
        };
        loadCategories();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        
        // Validation des champs obligatoires
        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Le nom de l\'événement est requis';
        }
        
        if (!formData.description || formData.description.trim() === '') {
            newErrors.description = 'La description est requise';
        }
        
        if (!formData.date) {
            newErrors.date = 'La date est requise';
        } else {
            const eventDate = new Date(formData.date);
            const now = new Date();
            if (eventDate < now) {
                newErrors.date = 'La date doit être dans le futur';
            }
        }
        
        if (!formData.location || formData.location.trim() === '') {
            newErrors.location = 'Le lieu est requis';
        }
        
        // Validation de maxParticipants
        const maxParticipantsValue = parseInt(formData.maxParticipants);
        if (!formData.maxParticipants || formData.maxParticipants === '') {
            newErrors.maxParticipants = 'Le nombre de participants est requis';
        } else if (isNaN(maxParticipantsValue) || maxParticipantsValue < 1) {
            newErrors.maxParticipants = 'Veuillez entrer un nombre de participants valide (minimum 1)';
        }

        // Validation du prix
        if (formData.price) {
            const priceValue = parseFloat(formData.price);
            if (isNaN(priceValue) || priceValue < 0) {
                newErrors.price = 'Le prix doit être un nombre positif';
            }
        }

        // Validation de l'URL de l'image
        if (formData.imageUrl) {
            try {
                new URL(formData.imageUrl);
            } catch (e) {
                newErrors.imageUrl = 'Veuillez entrer une URL d\'image valide';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, imageUrl: url }));
        
        // Effacer l'erreur si elle existe
        if (errors.imageUrl) {
            setErrors(prev => ({ ...prev, imageUrl: '' }));
        }

        // Mettre à jour la prévisualisation
        if (url) {
            try {
                new URL(url);
                setImagePreview(url);
            } catch (e) {
                setImagePreview(null);
            }
        } else {
            setImagePreview(null);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        let processedValue = value;
        
        // Traitement spécial pour maxParticipants
        if (name === 'maxParticipants') {
            processedValue = value.replace(/[^0-9]/g, '');
            if (processedValue === '') {
                processedValue = '';
            } else {
                const numValue = parseInt(processedValue);
                if (numValue > 0) {
                    processedValue = numValue.toString();
                }
            }
        }
        
        // Traitement spécial pour le prix
        if (name === 'price') {
            processedValue = value.replace(/[^0-9.]/g, '');
            if (processedValue === '') {
                processedValue = '';
            } else {
                const numValue = parseFloat(processedValue);
                if (!isNaN(numValue) && numValue >= 0) {
                    processedValue = numValue.toString();
                }
            }
        }
        
        const newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : processedValue
        };

        setFormData(newFormData);
        
        // Effacer l'erreur du champ modifié
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Notifier le parent des changements
        if (onChange) {
            onChange(newFormData);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrors({});

        if (!validateForm()) {
            return;
        }

        try {
            console.log('Données du formulaire avant envoi:', formData);

            const eventFormData = new FormData();
            
            // Ajouter les champs de base
            eventFormData.append('name', formData.name.trim());
            eventFormData.append('description', formData.description.trim());
            eventFormData.append('date', new Date(formData.date).toISOString());
            eventFormData.append('location', formData.location.trim());
            eventFormData.append('capacity', parseInt(formData.maxParticipants));
            
            // Ajouter les champs optionnels
            if (formData.price) {
                eventFormData.append('price', parseFloat(formData.price));
            }

            if (formData.category) {
                eventFormData.append('category', formData.category);
            }

            if (formData.isOnline) {
                eventFormData.append('isOnline', formData.isOnline);
            }

            if (formData.onlineMeetingLink) {
                eventFormData.append('onlineMeetingLink', formData.onlineMeetingLink);
            }

            if (formData.requirements) {
                eventFormData.append('requirements', formData.requirements);
            }

            if (formData.contactEmail) {
                eventFormData.append('contactEmail', formData.contactEmail);
            }

            if (formData.contactPhone) {
                eventFormData.append('contactPhone', formData.contactPhone);
            }

            // Ajouter l'URL de l'image si elle existe
            if (formData.imageUrl) {
                eventFormData.append('imageUrl', formData.imageUrl);
            }

            console.log('Données formatées pour l\'envoi:', {
                name: eventFormData.get('name'),
                description: eventFormData.get('description'),
                date: eventFormData.get('date'),
                location: eventFormData.get('location'),
                capacity: eventFormData.get('capacity'),
                price: eventFormData.get('price'),
                imageUrl: eventFormData.get('imageUrl')
            });

            if (onSubmit) {
                await onSubmit(eventFormData);
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            setErrors(prev => ({
                ...prev,
                submit: error.message || 'Une erreur est survenue lors de la sauvegarde'
            }));
        }
    };

    return (
        <div className="event-form">
            <h2>{mode === 'create' ? 'Créer un nouvel événement' : 'Modifier l\'événement'}</h2>
            
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errors.submit && <div className="error-message">{errors.submit}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nom de l'événement *</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nom de l'événement"
                        required
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description détaillée de l'événement"
                        required
                        className={errors.description ? 'error' : ''}
                    />
                    {errors.description && <div className="error-message">{errors.description}</div>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="date">Date *</label>
                        <input
                            id="date"
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className={errors.date ? 'error' : ''}
                        />
                        {errors.date && <div className="error-message">{errors.date}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="maxParticipants">Nombre de participants *</label>
                        <input
                            id="maxParticipants"
                            type="number"
                            name="maxParticipants"
                            value={formData.maxParticipants}
                            onChange={handleChange}
                            min="1"
                            step="1"
                            placeholder="Ex: 50"
                            required
                            className={errors.maxParticipants ? 'error' : ''}
                        />
                        {errors.maxParticipants && <div className="error-message">{errors.maxParticipants}</div>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">Prix (MAD)</label>
                        <div className="price-input">
                            <input
                                id="price"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="Ex: 25.00"
                                className={errors.price ? 'error' : ''}
                            />
                            <span className="currency">MAD</span>
                        </div>
                        {errors.price && <div className="error-message">{errors.price}</div>}
                        {!formData.price && <div className="price-hint">Laissez vide pour un événement gratuit</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Lieu *</label>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Lieu de l'événement"
                            required
                            className={errors.location ? 'error' : ''}
                        />
                        {errors.location && <div className="error-message">{errors.location}</div>}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="imageUrl">Image de l'événement</label>
                    <input
                        id="imageUrl"
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleImageUrlChange}
                        placeholder="https://exemple.com/image.jpg"
                        className={errors.imageUrl ? 'error' : ''}
                    />
                    {errors.imageUrl && <div className="error-message">{errors.imageUrl}</div>}
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Aperçu" />
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Enregistrement...' : (mode === 'create' ? 'Créer l\'événement' : 'Mettre à jour')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventForm;