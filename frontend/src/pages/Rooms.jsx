import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import Modal from '../components/Modal';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        room_number: '',
        type: 'single',
        price_per_night: '',
        status: 'available',
        capacity: 1,
        description: ''
    });

    const fetchRooms = async () => {
        try {
            const res = await api.get('/rooms');
            setRooms(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleOpenModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setFormData({ ...room });
        } else {
            setEditingRoom(null);
            setFormData({
                room_number: '',
                type: 'single',
                price_per_night: '',
                status: 'available',
                capacity: 1,
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingRoom) {
                await api.put(`/rooms/${editingRoom.id}`, formData);
            } else {
                await api.post('/rooms', formData);
            }
            fetchRooms();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette chambre ?')) {
            try {
                await api.delete(`/rooms/${id}`);
                fetchRooms();
            } catch (err) {
                console.error(err);
                alert("Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="rooms">
            <header className="page-header">
                <div>
                    <h1>Chambres</h1>
                    <p>Gérez les chambres et leurs disponibilités.</p>
                </div>
                <div className="header-btns">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Nouvelle Chambre
                    </button>
                </div>
            </header>

            <div className="card table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Rechercher une chambre..." />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>N° Chambre</th>
                            <th>Type</th>
                            <th>Capacité</th>
                            <th>Prix / Nuit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room.id}>
                                <td className="font-bold">{room.room_number}</td>
                                <td>{room.type}</td>
                                <td>{room.capacity} pers.</td>
                                <td>{room.price_per_night} €</td>
                                <td>
                                    <span className={`badge badge-${room.status === 'available' ? 'success' : room.status === 'occupied' ? 'danger' : 'warning'}`}>
                                        {room.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="icon-btn" title="Modifier" onClick={() => handleOpenModal(room)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn text-danger" title="Supprimer" onClick={() => handleDelete(room.id)}>
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
                title={editingRoom ? 'Modifier Chambre' : 'Nouvelle Chambre'}
            >
                <form onSubmit={handleSave}>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>N° Chambre</label>
                            <input 
                                type="text" 
                                required
                                value={formData.room_number}
                                onChange={e => setFormData({...formData, room_number: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select 
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="single">Single</option>
                                <option value="double">Double</option>
                                <option value="suite">Suite</option>
                                <option value="deluxe">Deluxe</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>Prix par nuit (€)</label>
                            <input 
                                type="number" 
                                required
                                value={formData.price_per_night}
                                onChange={e => setFormData({...formData, price_per_night: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacité</label>
                            <input 
                                type="number" 
                                required
                                value={formData.capacity}
                                onChange={e => setFormData({...formData, capacity: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select 
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="available">Disponible</option>
                            <option value="occupied">Occupée</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            rows="3"
                            value={formData.description || ''}
                            onChange={e => setFormData({...formData, description: e.target.value})}
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

export default Rooms;
