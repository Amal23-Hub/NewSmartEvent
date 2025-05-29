import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import EditEventPage from './pages/EditEventPage';
import EventRegistrationsPage from './pages/EventRegistrationsPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import ParticipantsPage from './pages/ParticipantsPage';
import CreateEventPage from './pages/CreateEventPage';
import PaymentPage from './pages/PaymentPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <div className="container">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/events/:id" element={<EventDetail />} />
                            <Route path="/events/:id/edit" element={<EditEventPage />} />
                            <Route path="/events/:id/registrations" element={<EventRegistrationsPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/admin/events/edit/:id" element={<EditEventPage />} />
                            <Route path="/participants" element={<ParticipantsPage />} />
                            <Route path="/events/create" element={<CreateEventPage />} />
                            <Route path="/payment/:eventId" element={<PaymentPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </div>
                </main>
                <Footer />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </Router>
    );
}

export default App;
