import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Edit2, Trash2, Filter, Calendar } from 'lucide-react';
import Modal from '../components/Modal';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [clients, setClients] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);
    const [formData, setFormData] = useState({
        client_id: '',
        room_id: '',
        check_in: '',
        check_out: '',
        status: 'pending',
        notes: ''
    });

    const fetchData = async () => {
        try {
            const [resRes, resCli, resRooms] = await Promise.all([
                api.get('/reservations'),
                api.get('/clients'),
                api.get('/rooms')
            ]);
            setReservations(resRes.data);
            setClients(resCli.data);
            setRooms(resRooms.data.filter(r => r.status === 'available' || (editingReservation && r.id === editingReservation.room_id)));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [editingReservation]);

    const handleOpenModal = (reservation = null) => {
        if (reservation) {
            setEditingReservation(reservation);
            setFormData({
                client_id: reservation.client_id,
                room_id: reservation.room_id,
                check_in: reservation.check_in,
                check_out: reservation.check_out,
                status: reservation.status,
                notes: reservation.notes || ''
            });
        } else {
            setEditingReservation(null);
            setFormData({
                client_id: '',
                room_id: '',
                check_in: '',
                check_out: '',
                status: 'pending',
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingReservation) {
                await api.put(`/reservations/${editingReservation.id}`, formData);
            } else {
                await api.post('/reservations', formData);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette réservation ?')) {
            try {
                await api.delete(`/reservations/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
                alert("Erreur lors de la suppression");
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            case 'completed': return 'info';
            default: return 'secondary';
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="reservations">
            <header className="page-header">
                <div>
                    <h1>Réservations</h1>
                    <p>Gérez les réservations et les séjours.</p>
                </div>
                <div className="header-btns">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Nouvelle Réservation
                    </button>
                </div>
            </header>

            <div className="card table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Rechercher une réservation..." />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Chambre</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Status</th>
                            <th>Prix Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((res) => (
                            <tr key={res.id}>
                                <td>
                                    <div className="client-cell">
                                        <div className="avatar-sm">{res.client.first_name[0]}</div>
                                        {res.client.first_name} {res.client.last_name}
                                    </div>
                                </td>
                                <td>{res.room.room_number}</td>
                                <td>{new Date(res.check_in).toLocaleDateString()}</td>
                                <td>{new Date(res.check_out).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge badge-${getStatusBadge(res.status)}`}>
                                        {res.status}
                                    </span>
                                </td>
                                <td>{res.total_price} €</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="icon-btn" title="Modifier" onClick={() => handleOpenModal(res)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn text-danger" title="Supprimer" onClick={() => handleDelete(res.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={editingReservation ? 'Modifier Réservation' : 'Nouvelle Réservation'}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Client</label>
                        <select 
                            required
                            value={formData.client_id}
                            onChange={e => setFormData({...formData, client_id: e.target.value})}
                        >
                            <option value="">Sélectionner un client</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Chambre</label>
                        <select 
                            required
                            value={formData.room_id}
                            onChange={e => setFormData({...formData, room_id: e.target.value})}
                        >
                            <option value="">Sélectionner une chambre disponible</option>
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>Chambre {r.room_number} ({r.type} - {r.price_per_night}€)</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>Check-in</label>
                            <input 
                                type="date" 
                                required
                                value={formData.check_in}
                                onChange={e => setFormData({...formData, check_in: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Check-out</label>
                            <input 
                                type="date" 
                                required
                                value={formData.check_out}
                                onChange={e => setFormData({...formData, check_out: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select 
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="completed">Terminée</option>
                            <option value="cancelled">Annulée</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea 
                            rows="2"
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                        ></textarea>
                    </div>
                    <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Reservations;
