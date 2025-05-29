export const formatDate = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const formatDateOnly = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const formatTimeOnly = (dateString) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return new Date(dateString).toLocaleTimeString('fr-FR', options);
};

export const isDatePast = (dateString) => {
    return new Date(dateString) < new Date();
};

export const isDateFuture = (dateString) => {
    return new Date(dateString) > new Date();
};

export const getDaysUntil = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}; 