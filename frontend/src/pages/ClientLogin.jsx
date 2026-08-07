import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Phone, Globe, DollarSign, ChevronDown, User, HelpCircle, X, Eye, Info, MapPin, Waves, Utensils, Users, Dumbbell, Bed, Flower, Check, Tv, Wifi, Star, MessageSquare } from 'lucide-react';
import './Login.css';

const ClientLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState('Hôtel');
    const [showRoomDetailsModal, setShowRoomDetailsModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Refs for Scrollspy
    const hotelRef = useRef(null);
    const servicesRef = useRef(null);
    const chambresRef = useRef(null);
    const installationsRef = useRef(null);
    const avisRef = useRef(null);
    const bookingsRef = useRef(null);

    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')));
    const [clientReservations, setClientReservations] = useState([]);
    const [bookingData, setBookingData] = useState({
        check_in: '',
        check_out: '',
        notes: ''
    });

    const sectionRefs = {
        'Hôtel': hotelRef,
        'Services': servicesRef,
        'Chambres': chambresRef,
        'Installations': installationsRef,
        'Avis': avisRef,
        'Mes Séjours': bookingsRef
    };

    const scrollToSection = (tab) => {
        setActiveSubTab(tab);
        const ref = sectionRefs[tab];
        if (ref.current) {
            const offset = 100; // Header height
            const elementPosition = ref.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px', // More precise "sweet spot" for active section
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSubTab(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        Object.values(sectionRefs).forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    // Login States
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        if (location.pathname === '/login') {
            setShowAuthModal(true);
            setActiveTab('login');
        } else if (location.pathname === '/register') {
            setShowAuthModal(true);
            setActiveTab('register');
        }
    }, [location.pathname]);

    useEffect(() => {
        if (userData) {
            fetchMyReservations();
        }
    }, [userData]);

    const fetchMyReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/my-reservations', { headers: { Authorization: `Bearer ${token}` } });
            setClientReservations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        setUserData(null);
        navigate('/login');
    };

    // Register States
    const [regData, setRegData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        date_of_birth: '',
        password: '',
    });
    const [regLoading, setRegLoading] = useState(false);
    const [regError, setRegError] = useState('');


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        try {
            const res = await api.post('/login', { login: loginEmail, password: loginPassword });
            const { user, token, client } = res.data;
            if (user.role !== 'client') {
                setLoginError("Cet espace est réservé aux clients.");
                setLoginLoading(false);
                return;
            }
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (client) localStorage.setItem('client', JSON.stringify(client));
            setUserData(user);
            setShowAuthModal(false);
            navigate('/');
        } catch (err) {
            setLoginError(err.response?.data?.message || 'Identifiants incorrects.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegLoading(true);
        setRegError('');
        try {
            const res = await api.post('/register', regData);
            const { user, token, client } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            if (client) localStorage.setItem('client', JSON.stringify(client));
            setUserData(user);
            setShowAuthModal(false);
            alert('Compte créé avec succès ! Bienvenue chez Barceló.');
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err.response?.data);
            setRegError(err.response?.data?.message || "Erreur lors de l'inscription.");
        } finally {
            setRegLoading(false);
        }
    };

    const handleFinalizeBooking = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const client = JSON.parse(localStorage.getItem('client') || '{}');
            
            await api.post('/reservations', {
                ...bookingData,
                room_id: selectedRoom.id,
                client_id: client.id,
                status: 'pending'
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            alert('Réservation effectuée avec succès ! Notre équipe vous contactera pour la confirmation.');
            setShowRoomDetailsModal(false);
            setBookingData({ check_in: '', check_out: '', notes: '' });
            fetchMyReservations(); // Refresh list
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la réservation. Vérifiez vos dates.");
        }
    };

    const [lang, setLang] = useState('Français');
    const [showLangMenu, setShowLangMenu] = useState(false);

    return (
        <div className="login-page">
            {/* Dark Top Bar */}
            <div className="top-bar">
                <div className="header-item"><Phone size={14} /> Réservez: +212 675 812 279</div>
                <div className="header-item">|</div>
                <div className="header-item" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowLangMenu(!showLangMenu)}>
                    {lang} <ChevronDown size={14} />
                    {showLangMenu && (
                        <div style={{ position: 'absolute', top: '100%', left: '0', background: '#333e48', border: '1px solid #444', zIndex: 1000, width: '120px' }}>
                            <div className="lang-opt" onClick={() => { setLang('Français'); setShowLangMenu(false); }}>Français</div>
                            <div className="lang-opt" onClick={() => { setLang('العربية'); setShowLangMenu(false); }}>العربية</div>
                            <div className="lang-opt" onClick={() => { setLang('English'); setShowLangMenu(false); }}>English</div>
                        </div>
                    )}
                </div>
                <div className="header-item">|</div>
                <div className="header-item"><Globe size={14} /> MAD</div>
                <div className="header-item"><HelpCircle size={14} /> Aide</div>
                {userData ? (
                    <div className="header-item" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                         <div style={{ color: '#00a8b4', fontWeight: 'bold' }}><User size={14} /> {userData.name}</div>
                         <div onClick={handleLogout} style={{ cursor: 'pointer', opacity: 0.8 }}>Déconnexion</div>
                    </div>
                ) : (
                    <div className="header-item" onClick={() => setShowAuthModal(true)} style={{ cursor: 'pointer' }}>
                        <User size={14} /> <strong>my Barceló</strong>
                    </div>
                )}
            </div>

            {/* White Main Header */}
            <header className="main-header" style={{ flexDirection: 'column', gap: '20px', padding: '30px 0' }}>
                <div className="hotel-logo">
                    <div style={{ color: '#333', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '1px' }}>Barceló</div>
                    <div style={{ color: '#666', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>HOTEL GROUP</div>
                </div>
                <nav className="header-nav" style={{ justifyContent: 'center', width: '100%', fontSize: '1.2rem' }}>
                    <span>Hôtels <ChevronDown size={14} /></span>
                </nav>
            </header>

            {/* Hero Section: Gallery */}
            <div className="client-hero-section" style={{ gridTemplateColumns: '1fr' }}>
                {/* Left: Gallery (4 small, 1 big) */}
                <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr) 2fr' }}>
                    <div className="gallery-item">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" alt="Room" />
                    </div>
                    <div className="gallery-item">
                        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800" alt="Restaurant" />
                    </div>
                    <div className="gallery-item">
                        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" alt="Building" />
                    </div>
                    <div className="gallery-item">
                        <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800" alt="Meeting" />
                    </div>
                    <div className="gallery-item big">
                        <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200" alt="Lobby" />
                    </div>
                </div>

                {/* Sub-navigation Bar exactly like screenshot */}
                <div className="hotel-sub-nav">
                    <div className="sub-nav-content">
                        {['Hôtel', 'Services', 'Chambres', 'Installations', 'Avis'].map(tab => (
                            <span
                                key={tab}
                                className={`sub-nav-link ${activeSubTab === tab ? 'active' : ''}`}
                                onClick={() => scrollToSection(tab)}
                            >
                                {tab}
                            </span>
                        ))}
                        {userData && (
                             <span
                                className={`sub-nav-link ${activeSubTab === 'Mes Séjours' ? 'active' : ''}`}
                                onClick={() => scrollToSection('Mes Séjours')}
                            >
                                Mes Séjours
                            </span>
                        )}
                    </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="sub-tab-content">
                        <div className="hotel-info-section" ref={hotelRef} id="Hôtel" style={{ marginBottom: '100px' }}>
                            <div className="info-text">
                                <h3>Barceló Fès Medina</h3>
                                <p>L'hôtel <strong>Barceló Fès Medina 4 étoiles</strong>, récemment rénové, bénéficie d'un emplacement stratégique au cœur de Fès, l'une des villes les plus emblématiques du Maroc. Cet établissement élégant, alliant à la perfection modernité et tradition, offre une expérience unique à tous les types de voyageurs, aussi bien pour des séjours d'affaires que des escapades romantiques, des voyages en famille ou encore des aventures culturelles.</p>

                                <p>Les 148 chambres de cet hôtel à Fès sont décorées dans un style contemporain et fonctionnel, pensé pour garantir un confort maximal. Sa proximité avec la Médina de Fès, classée au patrimoine mondial de l'UNESCO, permet aux voyageurs de s'immerger facilement dans l'histoire, l'art et la vie locale. De plus, son excellente connexion avec la gare (à seulement 5 minutes) et l'aéroport de Fès-Saïss (à 20 minutes) permet de rejoindre et de quitter l'hôtel sans complications.</p>

                                <p>L'hôtel offre des installations modernes à côté d'une médina historique, comprenant des espaces communs design et des services conçus pour répondre aux attentes des voyageurs les plus exigeants.</p>

                                <p>Pour les visiteurs souhaitant rester actifs pendant leur séjour, l'hôtel propose une salle de sport entièrement équipée, parfaite pour poursuivre votre routine d'entraînement. Des activités culturelles et de loisirs sont également organisées afin de découvrir la ville sous un autre angle, entre tradition et modernité.</p>

                                <h4 style={{ color: '#00a8b4', marginTop: '20px' }}>Cuisine d'auteur étoilée</h4>
                                <p>Le point fort de cet hôtel urbain au Maroc est son offre culinaire exceptionnelle, qui se déploie au sein de six espaces de restauration. Se distingue particulièrement <strong>La Dolce Vita</strong>, un restaurant italien dirigé par le chef Niki Pavanelli, récompensé d'une étoile Michelin en 2025, où les saveurs méditerranéennes se mêlent à la créativité et à l'excellence culinaire. À proximité se trouve Le Bistrot, proposant des spécialités marocaines dans une ambiance chaleureuse dans cet hôtel du centre-ville, tandis que les bars de l'hôtel invitent à profiter d'un cocktail, d'un café et de musique en direct.</p>
                            </div>
                            <div className="info-map">
                                <div className="map-placeholder">
                                    <img src="/fes_ville_nouvelle_map_1776452801140.png" alt="Map of Fès Ville Nouvelle" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }} />
                                    <div className="address-box">
                                        <strong>53 Av Hassan II, Champ de Courses</strong>
                                        <p>30000, Fès, Morocco</p>
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" alt="Hotel Building" style={{ width: '100%', marginTop: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                </div>
                            </div>
                        </div>

                        <div className="services-section" ref={servicesRef} id="Services" style={{ marginBottom: '100px' }}>
                            <h3 className="section-title">Pourquoi choisir l'hôtel Barceló Fès Medina ?</h3>
                            <div className="services-grid">
                                <div className="service-card">
                                    <div className="service-icon"><MapPin size={32} color="#00a8b4" /></div>
                                    <div className="service-name">Emplacement stratégique</div>
                                </div>
                                <div className="service-card">
                                    <div className="service-icon"><Waves size={32} color="#00a8b4" /></div>
                                    <div className="service-name">Piscine</div>
                                </div>
                                <div className="service-card">
                                    <div className="service-icon"><Utensils size={32} color="#00a8b4" /></div>
                                    <div className="service-name">Excellente gastronomie</div>
                                </div>
                                <div className="service-card">
                                    <div className="service-icon"><Users size={32} color="#00a8b4" /></div>
                                    <div className="service-name">Célébration de réunions et d'événements</div>
                                </div>
                                <div className="service-card">
                                    <div className="service-icon"><Flower size={32} color="#00a8b4" /></div>
                                    <div className="service-name">Fitness</div>
                                </div>
                                <div className="service-card">
                                    <div className="service-icon"><Bed size={32} color="#00a8b4" /></div>
                                    <div className="service-name">Chambres modernes et confortables</div>
                                </div>
                            </div>
                        </div>

                        <div className="rooms-section" ref={chambresRef} id="Chambres" style={{ marginBottom: '100px' }}>
                            <h3 className="section-title">Chambres de l'hôtel Barceló Fès Medina</h3>
                            <p className="section-desc">
                                Les <strong>148 chambres</strong> de cet hébergement au Maroc allient <strong>élégance, confort et fonctionnalité</strong>, offrant tout le nécessaire pour un séjour des plus agréables. Réparties en <strong>7 catégories</strong>, elles s'adaptent à tous les types de voyageurs.
                            </p>

                            {/* Room: Supérieure */}
                            <div className="room-card-horizontal">
                                <div className="room-image">
                                    <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800" alt="Chambre Supérieure" />
                                </div>
                                <div className="room-details">
                                    <div className="room-header-row">
                                        <h4>Supérieure</h4>
                                        <span className="details-link" onClick={() => {
                                            setSelectedRoom({
                                                name: 'Supérieure',
                                                image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=1200',
                                                desc: 'Les chambres supérieures sont idéales pour passer un séjour confortable au Maroc.',
                                                price: '70€'
                                            });
                                            setShowRoomDetailsModal(true);
                                        }}>Détails</span>
                                    </div>
                                    <p>Les chambres supérieures sont idéales pour passer un séjour confortable au Maroc.</p>
                                    <ul className="room-features">
                                        <li><Check size={16} color="#00a8b4" /> Coffre-fort</li>
                                        <li><Check size={16} color="#00a8b4" /> Articles de bain</li>
                                        <li><Check size={16} color="#00a8b4" /> Sèche-cheveux</li>
                                    </ul>
                                    <div className="room-occupancy">
                                        <Users size={20} /> <strong>3 personnes</strong> • 2 adultes max. / 1 enfants max.
                                    </div>
                                </div>
                                <div className="room-sidebar">
                                    <div className="price-tag">
                                        <span className="price-label">À partir de</span>
                                        <div className="price-value">70€ <span>/nuit</span></div>
                                    </div>
                                    <button
                                        className="availability-btn"
                                        onClick={() => {
                                            const user = JSON.parse(localStorage.getItem('user'));
                                            if (user) { navigate('/client/reservations'); }
                                            else { setShowAuthModal(true); setActiveTab('login'); }
                                        }}
                                    >
                                        Voir disponibilité
                                    </button>
                                </div>
                            </div>

                            {/* Room: Suite Deluxe */}
                            <div className="room-card-horizontal">
                                <div className="room-image">
                                    <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800" alt="Suite Deluxe" />
                                </div>
                                <div className="room-details">
                                    <div className="room-header-row">
                                        <h4>Suite Deluxe</h4>
                                        <span className="details-link" onClick={() => {
                                            setSelectedRoom({
                                                name: 'Suite Deluxe',
                                                image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
                                                desc: 'Chambres spacieuses et lumineuses dotées d\'équipements modernes pour se sentir comme à la maison.',
                                                price: '154€'
                                            });
                                            setShowRoomDetailsModal(true);
                                        }}>Détails</span>
                                    </div>
                                    <p>Chambres spacieuses et lumineuses dotées d'équipements modernes pour se sentir comme à la maison.</p>
                                    <ul className="room-features">
                                        <li><Check size={16} color="#00a8b4" /> Coffre-fort</li>
                                        <li><Check size={16} color="#00a8b4" /> Articles de bain</li>
                                        <li><Check size={16} color="#00a8b4" /> Minibar</li>
                                    </ul>
                                    <div className="room-occupancy">
                                        <Users size={20} /> <strong>4 personnes</strong> • 4 adultes max. / 2 enfants max.
                                    </div>
                                </div>
                                <div className="room-sidebar">
                                    <div className="price-tag">
                                        <span className="price-label">À partir de</span>
                                        <div className="price-value">154€ <span>/nuit</span></div>
                                    </div>
                                    <button
                                        className="availability-btn"
                                        onClick={() => {
                                            const user = JSON.parse(localStorage.getItem('user'));
                                            if (user) { navigate('/client/reservations'); }
                                            else { setShowAuthModal(true); setActiveTab('login'); }
                                        }}
                                    >
                                        Voir disponibilité
                                    </button>
                                </div>
                            </div>

                            {/* Room: Premium Suite */}
                            <div className="room-card-horizontal">
                                <div className="room-image">
                                    <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800" alt="Premium Suite" />
                                </div>
                                <div className="room-details">
                                    <div className="room-header-row">
                                        <h4>Premium Suite</h4>
                                        <span className="details-link" onClick={() => {
                                            setSelectedRoom({
                                                name: 'Premium Suite',
                                                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200',
                                                desc: 'Magnifique chambre avec vue panoramique sur la Médina et dotée d\'un mobilier élégant.',
                                                price: '250€'
                                            });
                                            setShowRoomDetailsModal(true);
                                        }}>Détails</span>
                                    </div>
                                    <p>Magnifique chambre avec vue panoramique sur la Médina et dotée d'un mobilier élégant.</p>
                                    <ul className="room-features">
                                        <li><Check size={16} color="#00a8b4" /> Coffre-fort</li>
                                        <li><Check size={16} color="#00a8b4" /> Articles de bain</li>
                                        <li><Check size={16} color="#00a8b4" /> Minibar</li>
                                    </ul>
                                    <div className="room-occupancy">
                                        <Users size={20} /> <strong>4 personnes</strong> • 4 adultes max. / 2 enfants max.
                                    </div>
                                </div>
                                <div className="room-sidebar">
                                    <div className="price-tag">
                                        <span className="price-label">À partir de</span>
                                        <div className="price-value">250€ <span>/nuit</span></div>
                                    </div>
                                    <button
                                        className="availability-btn"
                                        onClick={() => {
                                            const user = JSON.parse(localStorage.getItem('user'));
                                            if (user) { navigate('/client/reservations'); }
                                            else { setShowAuthModal(true); setActiveTab('login'); }
                                        }}
                                    >
                                        Voir disponibilité
                                    </button>
                                </div>
                            </div>

                            {/* Room: Deluxe Vue Médina */}
                            <div className="room-card-horizontal">
                                <div className="room-image">
                                    <img src="/room-deluxe.png" alt="Deluxe Vue Médina" />
                                </div>
                                <div className="room-details">
                                    <div className="room-header-row">
                                        <h4>Deluxe Vue Médina</h4>
                                        <span className="details-link" onClick={() => {
                                            setSelectedRoom({
                                                name: 'Deluxe Vue Médina',
                                                image: '/room-deluxe.png',
                                                desc: 'Chambres Deluxe avec vue sur la médina de Fès. Grandes, confortables et pleines de style.',
                                                price: '200€'
                                            });
                                            setShowRoomDetailsModal(true);
                                        }}>Détails</span>
                                    </div>
                                    <p>Chambres Deluxe avec vue sur la médina de Fès. Grandes, confortables et pleines de style.</p>
                                    <ul className="room-features">
                                        <li><Tv size={16} color="#00a8b4" /> TV</li>
                                        <li><Wifi size={16} color="#00a8b4" /> Connexion wifi (gratuit)</li>
                                        <li><Check size={16} color="#00a8b4" /> Sèche-cheveux</li>
                                    </ul>
                                    <div className="room-occupancy">
                                        <Users size={20} /> <strong>4 personnes</strong> • 3 adultes max. / 2 enfants max.
                                    </div>
                                </div>
                                <div className="room-sidebar">
                                    <div className="price-tag">
                                        <span className="price-label">À partir de</span>
                                        <div className="price-value">200€ <span>/nuit</span></div>
                                    </div>
                                    <button
                                        className="availability-btn"
                                        onClick={() => {
                                            const user = JSON.parse(localStorage.getItem('user'));
                                            if (user) { navigate('/client/reservations'); }
                                            else { setShowAuthModal(true); setActiveTab('login'); }
                                        }}
                                    >
                                        Voir disponibilité
                                    </button>
                                </div>
                            </div>

                            {/* Room: Junior Suite */}
                            <div className="room-card-horizontal">
                                <div className="room-image">
                                    <img src="https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=800" alt="Junior Suite" />
                                </div>
                                <div className="room-details">
                                    <div className="room-header-row">
                                        <h4>Junior Suite</h4>
                                        <span className="details-link" onClick={() => {
                                            setSelectedRoom({
                                                name: 'Junior Suite',
                                                image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&q=80&w=1200',
                                                desc: 'Espaces lumineux conçus pour le repos, disposant d\'un balcon avec vue sur la médina.',
                                                price: '180€'
                                            });
                                            setShowRoomDetailsModal(true);
                                        }}>Détails</span>
                                    </div>
                                    <p>Espaces lumineux conçus pour le repos, disposant d'un balcon avec vue sur la médina.</p>
                                    <ul className="room-features">
                                        <li><Check size={16} color="#00a8b4" /> Coffre-fort</li>
                                        <li><Check size={16} color="#00a8b4" /> Articles de bain</li>
                                        <li><Check size={16} color="#00a8b4" /> Minibar</li>
                                    </ul>
                                    <div className="room-occupancy">
                                        <Users size={20} /> <strong>4 personnes</strong> • 3 adultes max. / 2 enfants max.
                                    </div>
                                </div>
                                <div className="room-sidebar">
                                    <div className="price-tag">
                                        <span className="price-label">À partir de</span>
                                        <div className="price-value">180€ <span>/nuit</span></div>
                                    </div>
                                    <button
                                        className="availability-btn"
                                        onClick={() => {
                                            const user = JSON.parse(localStorage.getItem('user'));
                                            if (user) { navigate('/client/reservations'); }
                                            else { setShowAuthModal(true); setActiveTab('login'); }
                                        }}
                                    >
                                        Voir disponibilité
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="installations-section" ref={installationsRef} id="Installations" style={{ marginBottom: '100px' }}>
                            <div className="installations-header" style={{ marginBottom: '40px' }}>
                                <h3 className="section-title">Installations et services de l'hôtel Barceló Fès Medina</h3>
                                <p className="section-desc" style={{ fontSize: '1.2rem', color: '#666', maxWidth: '900px' }}>
                                    Les installations et services de cet hôtel 4 étoiles à Fès sont conçus pour offrir une expérience exceptionnelle à chaque voyageur.
                                </p>
                            </div>

                            <div className="installations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
                                <div className="inst-card wide" style={{ gridColumn: 'span 2' }}>
                                    <div className="inst-body">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h4 style={{ margin: 0 }}>L'Oasis Culinaire</h4>
                                            <span className="inst-overlay-badge" style={{ position: 'static' }}><Utensils size={16} /> Gastronomie</span>
                                        </div>
                                        <p style={{ marginBottom: '20px' }}>Son offre de restauration exceptionnelle se compose de <strong>2 restaurants et 4 bars</strong>, proposant un voyage entre cuisine marocaine traditionnelle et saveurs internationales.</p>

                                        <div className="cuisine-gallery-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
                                            <div className="gallery-item-v2">
                                                <div className="gallery-img-container" style={{ height: '150px' }}>
                                                    <img src="https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&q=80&w=800" alt="Buffet de Fruits" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                                <div className="gallery-caption">Buffet de Fruits Frais</div>
                                            </div>
                                            <div className="gallery-item-v2">
                                                <div className="gallery-img-container" style={{ height: '150px' }}>
                                                    <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800" alt="Petit-déjeuner" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                                <div className="gallery-caption">Petit-déjeuner & Café</div>
                                            </div>
                                            <div className="gallery-item-v2">
                                                <div className="gallery-img-container" style={{ height: '150px' }}>
                                                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" alt="Restaurant" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                                <div className="gallery-caption">Restaurant Gastronomique</div>
                                            </div>
                                            <div className="gallery-item-v2">
                                                <div className="gallery-img-container" style={{ height: '150px' }}>
                                                    <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" alt="Restaurant" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                                <div className="gallery-caption">Restaurant Gastronomique</div>
                                            </div>
                                            <div className="gallery-item-v2">
                                                <div className="gallery-img-container" style={{ height: '150px' }}>
                                                    <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" alt="Bar & Lounge" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                                <div className="gallery-caption">Bar & Cocktails Lounge</div>
                                            </div>
                                            <div className="gallery-item-v2">
                                                <div className="gallery-img-container" style={{ height: '150px' }}>
                                                    <img src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=800" alt="Hospitalité" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                                <div className="gallery-caption">Hospitalité & Douceurs</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="inst-card wide" style={{ gridColumn: 'span 2', marginTop: '40px' }}>
                                    <div className="inst-body">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                            <h4 style={{ margin: 0 }}>Réunions & Événements</h4>
                                            <span className="inst-overlay-badge" style={{ position: 'static' }}><Users size={16} /> Professionnel</span>
                                        </div>
                                        <p style={{ marginBottom: '20px' }}>Des espaces polyvalents et technologiquement équipés pour tous vos besoins professionnels.</p>

                                        <div className="cuisine-gallery-v2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                            <div className="gallery-item-v2">
                                                <div className="gallery-img-container" style={{ height: '150px' }}>
                                                    <img src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800" alt="Conference" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                                <div className="gallery-caption">Salles de Conférence</div>
                                            </div>
                                            <div className="gallery-item-v2">
                                                <div className="gallery-img-container" style={{ height: '150px' }}>
                                                    <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800" alt="Events" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                </div>
                                                <div className="gallery-caption">Événements Sociaux</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="reviews-section" ref={avisRef} id="Avis" style={{ padding: '60px 0' }}>
                            <div className="reviews-header" style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #eee', paddingBottom: '30px' }}>
                                <div>
                                    <h3 className="section-title" style={{ marginBottom: '10px' }}>Avis sur l'hôtel Barceló Fès Medina</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ display: 'flex', color: '#ffc107' }}>
                                            <Star size={24} fill="#ffc107" />
                                            <Star size={24} fill="#ffc107" />
                                            <Star size={24} fill="#ffc107" />
                                            <Star size={24} fill="#ffc107" />
                                            <Star size={24} color="#ccc" />
                                        </div>
                                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#333' }}>4.0/5</span>
                                        <span style={{ color: '#666', borderLeft: '1px solid #ccc', paddingLeft: '15px' }}><MessageSquare size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> 1576 Commentaires</span>
                                    </div>
                                </div>
                                <button
                                    className="availability-btn"
                                    style={{ width: 'auto', padding: '12px 30px' }}
                                    onClick={() => { setShowAuthModal(true); setActiveTab('login'); }}
                                >
                                    Donner mon avis
                                </button>
                            </div>

                            <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div className="review-card">
                                    <div className="review-user">
                                        <div className="user-avatar">M</div>
                                        <div>
                                            <div className="user-name">medixinnovation18</div>
                                            <div className="review-date">14 avr. 2026</div>
                                        </div>
                                    </div>
                                    <div className="review-content">
                                        <div className="review-rating">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#ffc107" color="#ffc107" />)}
                                        </div>
                                        <h4>Professionnel</h4>
                                        <p>Cet hôtel est utilisé régulièrement pour l’organisation de mes formations, et mon expérience a toujours été excellente. La salle est bien équipée, les pauses café sont bien organisées et le service est professionnel. Les chambres sont propres et confortables. Une expérience globale très satisfaisante</p>
                                        <span className="details-link" onClick={() => alert("Ce commentaire est déjà affiché dans son intégralité.")}>Lire commentaire complet</span>
                                    </div>
                                </div>

                                <div className="review-card">
                                    <div className="review-user">
                                        <div className="user-avatar" style={{ background: '#00a8b4' }}>I</div>
                                        <div>
                                            <div className="user-name">Ismaël R</div>
                                            <div className="review-date">13 avr. 2026</div>
                                        </div>
                                    </div>
                                    <div className="review-content">
                                        <div className="review-rating">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#ffc107" color="#ffc107" />)}
                                        </div>
                                        <h4>Vraiment top 👌</h4>
                                        <p>Excellent le service, rien à dire, sans oublier Fatima du room service qui est très aimable et serviable.</p>
                                        <span className="details-link" onClick={() => alert("Ce commentaire est déjà affiché dans son intégralité.")}>Lire commentaire complet</span>
                                    </div>
                                </div>

                                <div className="review-card">
                                    <div className="review-user">
                                        <div className="user-avatar" style={{ background: '#333e48' }}>Z</div>
                                        <div>
                                            <div className="user-name">zouhour s</div>
                                            <div className="review-date">9 avr. 2026</div>
                                        </div>
                                    </div>
                                    <div className="review-content">
                                        <div className="review-rating">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#ffc107" color="#ffc107" />)}
                                        </div>
                                        <h4>Très bon service</h4>
                                        <p>Excellent service au petit-déjeuner. Personnel accueillant et aux petits soins. Merci Samir pour le service!</p>
                                        <span className="details-link" onClick={() => alert("Ce commentaire est déjà affiché dans son intégralité.")}>Lire commentaire complet</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {userData && (
                            <div className="client-bookings-section" ref={bookingsRef} id="Mes Séjours" style={{ paddingBottom: '100px', borderTop: '1px solid #eee' }}>
                                <div style={{ textAlign: 'center', margin: '60px 0' }}>
                                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Mes Réservations</h3>
                                    <p style={{ color: '#666' }}>Voici l'historique de vos séjours chez Barceló Fès Medina</p>
                                </div>

                                <div className="bookings-timeline" style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
                                    {clientReservations.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '60px', background: '#f9f9f9', borderRadius: '15px' }}>
                                            <Calendar size={48} color="#ccc" style={{ marginBottom: '20px' }} />
                                            <h4>Aucun séjour pour le moment</h4>
                                            <p>Vos futures réservations apparaîtront ici.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gap: '20px' }}>
                                            {clientReservations.map(res => (
                                                <div key={res.id} className="booking-premium-card" style={{ background: 'white', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f0f0f0' }}>
                                                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                                                        <div style={{ width: '80px', height: '80px', background: '#00a8b410', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Bed color="#00a8b4" size={32} />
                                                        </div>
                                                        <div>
                                                            <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', color: '#00a8b4', fontWeight: 'bold', marginBottom: '5px' }}>
                                                                Chambre {res.room?.room_number} - {res.room?.type}
                                                            </div>
                                                            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{new Date(res.check_in).toLocaleDateString()} - {new Date(res.check_out).toLocaleDateString()}</h4>
                                                        </div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ 
                                                            padding: '6px 15px', 
                                                            borderRadius: '20px', 
                                                            fontSize: '0.8rem', 
                                                            fontWeight: 'bold',
                                                            background: res.status === 'confirmed' ? '#e6f7f8' : res.status === 'pending' ? '#fff8e6' : '#ffe6e6',
                                                            color: res.status === 'confirmed' ? '#00a8b4' : res.status === 'pending' ? '#ffa000' : '#ff4d4d',
                                                            display: 'inline-block',
                                                            marginBottom: '10px'
                                                        }}>
                                                            {res.status.toUpperCase()}
                                                        </div>
                                                        <div style={{ fontSize: '1.1rem', fontWeight: '900' }}>{res.total_price} €</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Room Details Modal */}
                {showRoomDetailsModal && (
                    <div className="auth-overlay">
                        <div className="auth-container" style={{ width: '900px', maxWidth: '95%', height: 'auto' }}>
                            <div className="auth-close" onClick={() => setShowRoomDetailsModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '5px', borderRadius: '50%' }}>
                                <X size={24} />
                            </div>
                            <div className="room-detail-view">
                                <img src={selectedRoom?.image} alt={selectedRoom?.name} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                                <div style={{ padding: '40px' }}>
                                    <h3 style={{ fontSize: '2rem', marginBottom: '20px' }}>{selectedRoom?.name}</h3>
                                    <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: '1.8', marginBottom: '30px' }}>
                                        {selectedRoom?.desc}
                                    </p>

                                    {userData ? (
                                        <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '15px', border: '1px solid #eee' }}>
                                            <h4 style={{ marginBottom: '20px', color: '#333' }}>Réserver votre séjour</h4>
                                            <form onSubmit={handleFinalizeBooking}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Arrivée</label>
                                                        <input type="date" required value={bookingData.check_in} onChange={e => setBookingData({...bookingData, check_in: e.target.value})} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Départ</label>
                                                        <input type="date" required value={bookingData.check_out} onChange={e => setBookingData({...bookingData, check_out: e.target.value})} />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Demandes spéciales</label>
                                                    <textarea rows="2" value={bookingData.notes} onChange={e => setBookingData({...bookingData, notes: e.target.value})} placeholder="Notes (ex: lit bébé, arrivée tardive...)"></textarea>
                                                </div>
                                                <button type="submit" className="availability-btn" style={{ width: '100%', marginTop: '10px' }}>
                                                    Confirmer ma réservation pour {selectedRoom?.price}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <button
                                            className="availability-btn"
                                            style={{ background: '#333e48', color: 'white', padding: '15px 40px', fontSize: '1.1rem' }}
                                            onClick={() => {
                                                setShowRoomDetailsModal(false);
                                                setShowAuthModal(true);
                                                setActiveTab('login');
                                            }}
                                        >
                                            Se connecter pour réserver
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlaid Auth Modal */}
                {showAuthModal && (
                    <div className="auth-overlay">
                        <div className="auth-container" style={{ alignSelf: 'center', width: '500px' }}>
                            <div className="auth-card-header" style={{ padding: '24px 24px 0', textAlign: 'center', position: 'relative' }}>
                                <div className="auth-close" onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '15px', right: '15px', cursor: 'pointer' }}>
                                    <X size={24} />
                                </div>
                                <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#333' }}>myBarceló</div>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 'bold', borderTop: '1px solid #333' }}>BENEFITS</div>
                                </div>

                                <div className="auth-tabs">
                                    <div
                                        className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('login')}
                                    >
                                        Se connecter
                                    </div>
                                    <div
                                        className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('register')}
                                    >
                                        S'inscrire
                                    </div>
                                </div>
                            </div>

                            <div className="auth-body" style={{ padding: '32px' }}>
                                {activeTab === 'login' ? (
                                    <form onSubmit={handleLogin}>
                                        <h3>Accéder à my Barceló</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px' }}>Veuillez noter que tous les champs sont obligatoires</p>
                                        {loginError && <div className="login-error">{loginError}</div>}
                                        <div className="form-group">
                                            <label>E-mail</label>
                                            <input type="email" placeholder="Saisissez votre e-mail" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Mot de passe</label>
                                            <div className="input-with-icon">
                                                <input type={showPassword ? "text" : "password"} placeholder="Saisissez votre mot de passe" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                                                <div className="input-icon" onClick={() => setShowPassword(!showPassword)}><Eye size={18} /></div>
                                            </div>
                                        </div>
                                        <button type="submit" className="login-btn" disabled={loginLoading}>
                                            {loginLoading ? 'Connexion...' : 'Se connecter'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleRegister}>
                                        <h3>Créer un compte</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '24px' }}>Veuillez noter que tous les champs sont obligatoires</p>
                                        {regError && <div className="login-error">{regError}</div>}
                                        <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                            <div className="form-group">
                                                <label>Prénom</label>
                                                <input type="text" placeholder="Prénom" required value={regData.first_name} onChange={e => setRegData({ ...regData, first_name: e.target.value })} />
                                            </div>
                                            <div className="form-group">
                                                <label>Nom</label>
                                                <input type="text" placeholder="Nom" required value={regData.last_name} onChange={e => setRegData({ ...regData, last_name: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>E-mail</label>
                                            <input type="email" placeholder="votre@email.com" required value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Date de naissance</label>
                                            <input type="date" required value={regData.date_of_birth} onChange={e => setRegData({ ...regData, date_of_birth: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label>Mot de passe</label>
                                            <div className="input-with-icon">
                                                <input type={showPassword ? "text" : "password"} placeholder="8+ caractères" required value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} />
                                                <div className="input-icon" onClick={() => setShowPassword(!showPassword)}><Eye size={18} /></div>
                                            </div>
                                        </div>
                                        <button type="submit" className="login-btn btn-secondary" disabled={regLoading}>
                                            {regLoading ? 'Création...' : 'S\'inscrire'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
};

export default ClientLogin;
