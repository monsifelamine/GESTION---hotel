import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
    Users, 
    BedDouble, 
    CalendarCheck, 
    TrendingUp,
    MoreVertical,
    Wallet,
    Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const DashboardCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="card dashboard-card">
        <div className="card-header">
            <div className={`icon-container ${color}`}>
                <Icon size={24} />
            </div>
            <button className="icon-btn">
                <MoreVertical size={18} />
            </button>
        </div>
        <div className="card-body">
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
        {trend && (
            <div className="card-footer">
                <span className="trend-pos">
                    <TrendingUp size={14} /> +{trend}%
                </span>
                <span> vs mois dernier</span>
            </div>
        )}
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/dashboard')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Chargement...</div>;

    const cards = [
        { title: 'Total Clients', value: stats?.total_clients || 0, icon: Users, color: 'blue', trend: 12 },
        { title: 'Chambres Dispos', value: stats?.available_rooms || 0, icon: BedDouble, color: 'green', trend: 5 },
        { title: 'Réservations Pend.', value: stats?.pending_reservations || 0, icon: CalendarCheck, color: 'orange', trend: 8 },
        { title: 'Chiffre d\'affaires', value: `${stats?.total_revenue || 0} €`, icon: TrendingUp, color: 'purple', trend: 15 },
    ];

    const months = ['Jan', 'Féb', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const maxRevenue = Math.max(...(stats?.revenue_chart?.map(r => r.aggregate) || [1000]));


    return (
        <div className="dashboard">
            <header className="page-header">
                <div>
                    <h1>Tableau de bord</h1>
                    <p>Bienvenue dans votre gestionnaire d'hôtel.</p>
                </div>
                <div className="header-btns">
                    <button className="btn btn-primary" onClick={() => navigate('/reservations')}>Nouvelle Réservation</button>
                </div>
            </header>

            <div className="dashboard-grid">
                {cards.map((card, i) => (
                    <DashboardCard key={i} {...card} />
                ))}
            </div>

            <div className="dashboard-sections">
                <section className="recent-activity card">
                    <div className="section-header">
                        <h2>Réservations Récentes</h2>
                        <button className="btn-ghost" onClick={() => navigate('/reservations')}>Voir tout</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Chambre</th>
                                <th>Check-in</th>
                                <th>Status</th>
                                <th>Prix</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recent_reservations?.map((res) => (
                                <tr key={res.id}>
                                    <td>
                                        <div className="client-cell">
                                            <div className="avatar-sm">{res.client.first_name[0]}</div>
                                            {res.client.first_name} {res.client.last_name}
                                        </div>
                                    </td>
                                    <td>{res.room.room_number}</td>
                                    <td>{new Date(res.check_in).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge badge-${res.status === 'confirmed' ? 'success' : 'warning'}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td>{res.total_price} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="revenue-chart card">
                    <div className="section-header">
                        <h2>Revenus Mensuels</h2>
                        <TrendingUp size={18} className="text-muted" />
                    </div>
                    <div className="chart-container">
                        {stats?.revenue_chart?.map((data, index) => (
                            <div key={index} className="chart-bar-group">
                                <motion.div 
                                    className="chart-bar"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(data.aggregate / maxRevenue) * 150}px` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                />
                                <span className="chart-label">{months[parseInt(data.month) - 1]}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
