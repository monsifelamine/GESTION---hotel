import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, User } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import api from '../services/api';
import { useState, useEffect } from 'react';
import './Layout.css';

const Layout = () => {
    const [notifOpen, setNotifOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get('/notifications');
            const unread = res.data.filter(n => !n.is_read).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <header className="top-header">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Rechercher..." />
                    </div>
                    <div className="header-actions">
                        <div className="notification-wrapper">
                            <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                                <Bell size={20} />
                                {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
                            </button>
                            <NotificationDropdown 
                                isOpen={notifOpen} 
                                onClose={() => {
                                    setNotifOpen(false);
                                    fetchUnreadCount();
                                }} 
                            />
                        </div>
                        <div className="user-profile" onClick={() => navigate('/settings')}>
                            <div className="avatar">
                                <User size={20} />
                            </div>
                            <div className="user-info">
                                <span className="user-name">Admin Hotel</span>
                                <span className="user-role">Administrateur</span>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
