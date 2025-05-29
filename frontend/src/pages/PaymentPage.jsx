import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaLock, FaDownload, FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEnvelope, FaTicketAlt } from 'react-icons/fa';
import { getEventById } from '../services/eventService';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import './PaymentPage.css';

const PaymentPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const qrRef = useRef(null);
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        email: ''
    });
    const [showSummary, setShowSummary] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventById(eventId);
                setEvent(data);
                setError(null);
            } catch (err) {
                setError('Impossible de charger les détails de l\'événement');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        // Affiche le résumé après 200ms, puis la sécurité après 700ms
        const summaryTimeout = setTimeout(() => setShowSummary(true), 200);
        const securityTimeout = setTimeout(() => setShowSecurity(true), 700);
        return () => {
            clearTimeout(summaryTimeout);
            clearTimeout(securityTimeout);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Simuler un traitement de paiement
            await new Promise(resolve => setTimeout(resolve, 1500));
            setPaymentSuccess(true);
        } catch (error) {
            alert('Une erreur est survenue lors du paiement. Veuillez réessayer.');
        }
    };

    const handleDownloadTicket = async () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

            // Ajout du logo en haut du ticket
            try {
                const logo = new Image();
                logo.src = window.location.origin + '/assets/image.png';
                await new Promise((resolve, reject) => {
                    logo.onload = () => {
                        const logoWidth = 60;
                        const logoHeight = (logo.height * logoWidth) / logo.width;
                        doc.addImage(logo, 'PNG', pageWidth / 2 - logoWidth / 2, margin, logoWidth, logoHeight);
                        resolve();
                    };
                    logo.onerror = resolve;
                });
            } catch (e) {
                console.error('Erreur chargement logo', e);
            }

            // Fond blanc et bordure colorée
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            doc.setDrawColor(41, 128, 185);
            doc.setLineWidth(3);
            doc.rect(margin/2, margin/2, pageWidth - margin, pageHeight - margin, 'S');

            // Titre principal
            doc.setFontSize(22);
            doc.setTextColor(41, 128, 185);
            doc.setFont(undefined, 'bold');
            doc.text('TICKET D\'ENTRÉE', pageWidth / 2, margin + 10 + 20, { align: 'center' });

            // Image de l'événement centrée
            let imageHeight = 0;
            let imageUrl = event.image || fallbackImage;
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.crossOrigin = "Anonymous";
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        const imgWidth = 90;
                        imageHeight = (img.height * imgWidth) / img.width;
                        canvas.width = imgWidth;
                        canvas.height = imageHeight;
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, imgWidth, imageHeight);
                        ctx.drawImage(img, 0, 0, imgWidth, imageHeight);
                        const imgData = canvas.toDataURL('image/jpeg', 1.0);
                        doc.addImage(imgData, 'JPEG', pageWidth / 2 - imgWidth / 2, margin + 18 + 20, imgWidth, imageHeight);
                        resolve();
                    };
                    img.onerror = () => {
                        if (imageUrl !== fallbackImage) {
                            imageUrl = fallbackImage;
                            img.src = fallbackImage;
                        } else {
                            resolve();
                        }
                    };
                    img.src = imageUrl;
                });
            } catch (error) {
                imageHeight = 0;
            }

            // Détails de l'événement à gauche
            const detailsStartY = margin + 30 + imageHeight;
            doc.setFontSize(12);
            doc.setTextColor(44, 62, 80);
            doc.setFont(undefined, 'bold');
            const details = [
                { label: 'Événement', value: event.name },
                { label: 'Date', value: new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                { label: 'Lieu', value: event.location },
                { label: 'Prix', value: `${event.price} €` },
                { label: 'Acheteur', value: formData.cardName },
                { label: 'Email', value: formData.email },
                { label: 'Date d\'achat', value: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
            ];
            let y = detailsStartY;
            details.forEach((detail) => {
                doc.setFont(undefined, 'bold');
                doc.text(`${detail.label} :`, margin + 10, y);
                doc.setFont(undefined, 'normal');
                doc.text(detail.value, margin + 45, y);
                y += 10;
            });

            // QR code à droite
            if (qrRef.current) {
                try {
                    const qrImage = qrRef.current.toDataURL('image/png');
                    doc.addImage(qrImage, 'PNG', pageWidth - margin - 50, detailsStartY, 40, 40);
                } catch (error) {}
            }

            // Instructions en bas
            doc.setFontSize(11);
            doc.setTextColor(41, 128, 185);
            doc.setFont(undefined, 'bold');
            doc.text('Instructions :', margin + 10, pageHeight - margin - 35);
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            const instructions = [
                '1. Présentez ce ticket à l\'entrée de l\'événement',
                '2. Le QR code sera scanné pour vérification',
                '3. Conservez ce ticket jusqu\'à la fin de l\'événement'
            ];
            instructions.forEach((instruction, index) => {
                doc.text(instruction, margin + 10, pageHeight - margin - 25 + (index * 7));
            });

            // Pied de page
            doc.setFontSize(8);
            doc.setTextColor(180, 180, 180);
            doc.setFont(undefined, 'italic');
            doc.text('Merci de votre confiance !', pageWidth / 2, pageHeight - 8, { align: 'center' });

            // Numéro de ticket unique
            const ticketNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
            doc.setFontSize(8);
            doc.setTextColor(180, 180, 180);
            doc.text(`Ticket #${ticketNumber}`, pageWidth - margin - 10, pageHeight - 8, { align: 'right' });

            // Sauvegarder le PDF
            doc.save(`ticket-${event.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        } catch (error) {
            setError('Erreur lors de la génération du ticket. Veuillez réessayer.');
        }
    };

    if (loading) return <div className="payment-loading">Chargement...</div>;
    if (error) return <div className="payment-error">{error}</div>;
    if (!event) return <div className="payment-error">Événement non trouvé</div>;

    if (paymentSuccess) {
        return (
            <div className="payment-page">
                <div className="payment-container success-container">
                    <div className="success-message">
                        <FaCheckCircle className="success-icon" />
                        <h1>Paiement réussi !</h1>
                        <p>Votre ticket a été généré avec succès.</p>
                    </div>
                    <div className="ticket-actions">
                        <div style={{ display: 'none' }}>
                            <QRCodeCanvas
                                ref={qrRef}
                                value={JSON.stringify({
                                    eventId: event.id,
                                    eventName: event.name,
                                    date: event.date,
                                    ticketNumber: Math.random().toString(36).substr(2, 9).toUpperCase()
                                })}
                                size={100}
                                level="H"
                                bgColor="#ffffff"
                                fgColor="#0078d7"
                            />
                        </div>
                        <button onClick={handleDownloadTicket} className="download-button">
                            <FaDownload /> Télécharger le ticket
                        </button>
                        <button onClick={() => navigate('/events')} className="return-button">
                            Retour aux événements
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Retour
                </button>

                <div className="payment-header">
                    <h1>Paiement du ticket</h1>
                    {showSummary && (
                        <div className="event-summary fade-in">
                            <h2>{event.name}</h2>
                            <p className="event-price">{event.price.toFixed(2)} MAD</p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="form-group">
                        <label htmlFor="cardNumber">Numéro de carte</label>
                        <div className="input-with-icon">
                            <FaCreditCard className="input-icon" />
                            <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="cardName">Nom sur la carte</label>
                        <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            placeholder="JEAN DUPONT"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expiryDate">Date d'expiration</label>
                            <input
                                type="text"
                                id="expiryDate"
                                name="expiryDate"
                                placeholder="MM/AA"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cvv">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="jean.dupont@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    {showSecurity && (
                        <div className="payment-security fade-in">
                            <FaLock className="security-icon" />
                            <p>Paiement sécurisé</p>
                        </div>
                    )}

                    <button type="submit" className="pay-button">
                        Payer {event.price.toFixed(2)} MAD
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage; 