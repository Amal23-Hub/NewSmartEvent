import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft, FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaEnvelope } from 'react-icons/fa';
import { getEventById } from '../services/eventService';
import jsPDF from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import './DownloadTicketPage.css';

const DownloadTicketPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const qrRef = useRef(null);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: ''
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDownloadTicket = async () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

            // Fond coloré moderne
            doc.setFillColor(245, 247, 250);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // Logo en filigrane (fond, semi-transparent via canvas)
            const LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."; // (très long)
            const watermark = new Image();
            watermark.src = LOGO_BASE64;
            await new Promise((resolve) => {
                watermark.onload = () => {
                    const wmWidth = 120;
                    const wmHeight = (watermark.height * wmWidth) / watermark.width;
                    const canvas = document.createElement('canvas');
                    canvas.width = wmWidth;
                    canvas.height = wmHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.globalAlpha = 0.12;
                    ctx.drawImage(watermark, 0, 0, wmWidth, wmHeight);
                    const wmData = canvas.toDataURL('image/png');
                    doc.addImage(wmData, 'PNG', (pageWidth - wmWidth) / 2, (pageHeight - wmHeight) / 2, wmWidth, wmHeight);
                    resolve();
                };
                watermark.onerror = resolve;
            });

            // Cadre moderne
            doc.setDrawColor(110, 72, 170);
            doc.setLineWidth(4);
            doc.roundedRect(margin/2, margin/2, pageWidth - margin, pageHeight - margin, 12, 12, 'S');

            // Logo en haut à gauche (petit)
            const logo = new Image();
            logo.src = LOGO_BASE64;
            await new Promise((resolve) => {
                logo.onload = () => {
                    const logoWidth = 32;
                    const logoHeight = (logo.height * logoWidth) / logo.width;
                    doc.addImage(logo, 'PNG', margin + 2, margin + 2, logoWidth, logoHeight);
                    resolve();
                };
                logo.onerror = resolve;
            });

            // Titre principal modernisé
            doc.setFontSize(28);
            doc.setTextColor(110, 72, 170);
            doc.setFont(undefined, 'bold');
            doc.text('TICKET D\'ENTRÉE', pageWidth / 2, margin + 18, { align: 'center' });

            // Image de l'événement centrée
            let imageHeight = 0;
            let imageUrl = event.image || fallbackImage;
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.crossOrigin = "Anonymous";
                await new Promise((resolve) => {
                    img.onload = () => {
                        const imgWidth = 80;
                        imageHeight = (img.height * imgWidth) / img.width;
                        canvas.width = imgWidth;
                        canvas.height = imageHeight;
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, imgWidth, imageHeight);
                        ctx.drawImage(img, 0, 0, imgWidth, imageHeight);
                        const imgData = canvas.toDataURL('image/jpeg', 1.0);
                        doc.addImage(imgData, 'JPEG', pageWidth / 2 - imgWidth / 2, margin + 30, imgWidth, imageHeight);
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

            // Détails de l'événement
            const detailsStartY = margin + 45 + imageHeight;
            doc.setFontSize(13);
            doc.setTextColor(44, 62, 80);
            doc.setFont(undefined, 'bold');
            const details = [
                { label: 'Événement', value: event.name },
                { label: 'Date', value: new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
                { label: 'Lieu', value: event.location },
                { label: 'Prix', value: `${event.price} €` },
                { label: 'Acheteur', value: userInfo.name },
                { label: 'Email', value: userInfo.email },
                { label: 'Date d\'achat', value: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
            ];
            let y = detailsStartY;
            details.forEach((detail) => {
                doc.setFont(undefined, 'bold');
                doc.text(`${detail.label} :`, margin + 10, y);
                doc.setFont(undefined, 'normal');
                doc.text(detail.value, margin + 50, y);
                y += 11;
            });

            // QR code en bas à droite
            if (qrRef.current) {
                try {
                    const qrImage = qrRef.current.toDataURL('image/png');
                    doc.addImage(qrImage, 'PNG', pageWidth - margin - 45, pageHeight - margin - 45, 40, 40);
                } catch (error) {}
            }

            // Message de remerciement stylisé
            doc.setFontSize(13);
            doc.setTextColor(110, 72, 170);
            doc.setFont(undefined, 'bolditalic');
            doc.text('Merci pour votre confiance et bonne participation !', pageWidth / 2, pageHeight - margin - 10, { align: 'center' });

            // Numéro de ticket unique
            const ticketNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
            doc.setFontSize(9);
            doc.setTextColor(180, 180, 180);
            doc.setFont(undefined, 'italic');
            doc.text(`Ticket #${ticketNumber}`, pageWidth - margin - 10, pageHeight - 8, { align: 'right' });

            // Sauvegarder le PDF
            doc.save(`ticket-${event.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        } catch (error) {
            setError('Erreur lors de la génération du ticket. Veuillez réessayer.');
        }
    };

    if (loading) return <div className="download-loading">Chargement...</div>;
    if (error) return <div className="download-error">{error}</div>;
    if (!event) return <div className="download-error">Événement non trouvé</div>;

    return (
        <div className="download-page">
            <div className="download-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Retour
                </button>

                <div className="download-header">
                    <h1>Télécharger votre ticket</h1>
                    <div className="event-summary">
                        <h2>{event.name}</h2>
                        <div className="event-details">
                            <div className="detail-item">
                                <FaCalendarAlt />
                                <span>{new Date(event.date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                            <div className="detail-item">
                                <FaMapMarkerAlt />
                                <span>{event.location}</span>
                            </div>
                            <div className="detail-item">
                                <FaTicketAlt />
                                <span>{event.price} €</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="download-form">
                    <div className="form-group">
                        <label htmlFor="name">
                            <FaUser className="input-icon" />
                            Votre nom
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={userInfo.name}
                            onChange={handleInputChange}
                            placeholder="Entrez votre nom"
                            required
                        />
                    </div>
                   

                    <div className="form-group">
                        <label htmlFor="email">
                            <FaEnvelope className="input-icon" />
                            Votre email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>

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

                    <button 
                        type="button" 
                        onClick={handleDownloadTicket}
                        className="download-button"
                        disabled={!userInfo.name || !userInfo.email}
                    >
                        <FaDownload /> Télécharger le ticket
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DownloadTicketPage; 