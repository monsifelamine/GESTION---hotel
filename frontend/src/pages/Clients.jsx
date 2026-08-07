import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import Modal from '../components/Modal';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        cin_passport: '',
        nationality: ''
    });

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleOpenModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData({ ...client });
        } else {
            setEditingClient(null);
            setFormData({
                first_name: '',
                last_name: '',
                phone: '',
                cin_passport: '',
                nationality: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingClient) {
                await api.put(`/clients/${editingClient.id}`, formData);
            } else {
                await api.post('/clients', formData);
            }
            fetchClients();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
            try {
                await api.delete(`/clients/${id}`);
                fetchClients();
            } catch (err) {
                console.error(err);
                alert("Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="clients">
            <header className="page-header">
                <div>
                    <h1>Clients</h1>
                    <p>Gérez vos clients et leurs informations.</p>
                </div>
                <div className="header-btns">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Nouveau Client
                    </button>
                </div>
            </header>

            <div className="card table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Rechercher un client..." />
                    </div>
                    <button className="btn btn-ghost">
                        <Filter size={18} /> Filtrer
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Nom & Prénom</th>
                            <th>CIN / Passport</th>
                            <th>Nationalité</th>
                            <th>Téléphone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>
                                    <div className="client-cell">
                                        <div className="avatar-sm">{client.first_name[0]}</div>
                                        {client.first_name} {client.last_name}
                                    </div>
                                </td>
                                <td>{client.cin_passport}</td>
                                <td>{client.nationality}</td>
                                <td>{client.phone}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="icon-btn" title="Modifier" onClick={() => handleOpenModal(client)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn text-danger" title="Supprimer" onClick={() => handleDelete(client.id)}>
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
                title={editingClient ? 'Modifier Client' : 'Nouveau Client'}
            >
                <form onSubmit={handleSave}>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>Prénom</label>
                            <input 
                                type="text" 
                                required
                                value={formData.first_name}
                                onChange={e => setFormData({...formData, first_name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom</label>
                            <input 
                                type="text" 
                                required
                                value={formData.last_name}
                                onChange={e => setFormData({...formData, last_name: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>CIN / Passeport</label>
                        <input 
                            type="text" 
                            required
                            value={formData.cin_passport}
                            onChange={e => setFormData({...formData, cin_passport: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Téléphone</label>
                        <input 
                            type="text" 
                            required
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nationalité</label>
                        <input 
                            type="text" 
                            required
                            value={formData.nationality}
                            onChange={e => setFormData({...formData, nationality: e.target.value})}
                        />
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

export default Clients;

