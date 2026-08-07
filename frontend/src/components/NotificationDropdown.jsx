import { useEffect, useState } from 'react';
import api from '../services/api';
import { Bell, Check, Trash2, X } from 'lucide-react';

const NotificationDropdown = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="notification-dropdown">
            <div className="dropdown-header">
                <h3>Notifications</h3>
                <div className="header-actions">
                    <button onClick={markAllAsRead} className="btn-text">Tout marquer comme lu</button>
                    <button onClick={onClose} className="icon-btn"><X size={18} /></button>
                </div>
            </div>
            <div className="dropdown-body">
                {loading ? (
                    <div className="loading">Chargement...</div>
                ) : notifications.length === 0 ? (
                    <div className="empty">Aucune notification</div>
                ) : (
                    notifications.map(notification => (
                        <div key={notification.id} className={`notification-item ${notification.is_read ? 'read' : 'unread'}`}>
                            <div className="item-content">
                                <p>{notification.message}</p>
                                <span className="time">{new Date(notification.created_at).toLocaleString()}</span>
                            </div>
                            <div className="item-actions">
                                {!notification.is_read && (
                                    <button onClick={() => markAsRead(notification.id)} className="icon-btn success" title="Marquer comme lu">
                                        <Check size={14} />
                                    </button>
                                )}
                                <button onClick={() => deleteNotification(notification.id)} className="icon-btn danger" title="Supprimer">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
