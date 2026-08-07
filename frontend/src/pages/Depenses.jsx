import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Edit2, Trash2, Filter, Wallet } from 'lucide-react';
import Modal from '../components/Modal';

const Depenses = () => {
    const [depenses, setDepenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepense, setEditingDepense] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Utility',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    const fetchDepenses = async () => {
        try {
            const res = await api.get('/depenses');
            setDepenses(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepenses();
    }, []);

    const handleOpenModal = (depense = null) => {
        if (depense) {
            setEditingDepense(depense);
            setFormData({ ...depense });
        } else {
            setEditingDepense(null);
            setFormData({
                title: '',
                amount: '',
                category: 'Utility',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingDepense) {
                await api.put(`/depenses/${editingDepense.id}`, formData);
            } else {
                await api.post('/depenses', formData);
            }
            fetchDepenses();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer cette dépense ?')) {
            try {
                await api.delete(`/depenses/${id}`);
                fetchDepenses();
            } catch (err) {
                console.error(err);
                alert("Erreur lors de la suppression");
            }
        }
    };

    if (loading) return <div>Chargement...</div>;

    const totalDepenses = depenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    return (
        <div className="depenses">
            <header className="page-header">
                <div>
                    <h1>Dépenses</h1>
                    <p>Suivi des charges et dépenses de l'hôtel.</p>
                </div>
                <div className="header-btns">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Nouvelle Dépense
                    </button>
                </div>
            </header>

            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '1.5rem' }}>
                <div className="card dashboard-card">
                    <div className="card-header">
                        <div className="icon-container purple">
                            <Wallet size={24} />
                        </div>
                    </div>
                    <div className="card-body">
                        <h3>{totalDepenses.toFixed(2)} €</h3>
                        <p>Total Dépenses</p>
                    </div>
                </div>
            </div>

            <div className="card table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Rechercher une dépense..." />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Catégorie</th>
                            <th>Montant</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {depenses.map((depense) => (
                            <tr key={depense.id}>
                                <td>
                                    <div className="depense-cell">
                                        <span className="depense-title">{depense.title}</span>
                                        {depense.description && <small>{depense.description}</small>}
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-info">{depense.category}</span>
                                </td>
                                <td className="text-danger">-{depense.amount} €</td>
                                <td>{new Date(depense.date).toLocaleDateString()}</td>
                                <td>
                                    <div className="action-btns">
                                        <button className="icon-btn" title="Modifier" onClick={() => handleOpenModal(depense)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn text-danger" title="Supprimer" onClick={() => handleDelete(depense.id)}>
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
                title={editingDepense ? 'Modifier Dépense' : 'Nouvelle Dépense'}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Titre</label>
                        <input 
                            type="text" 
                            required
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label>Montant (€)</label>
                            <input 
                                type="number" 
                                required
                                value={formData.amount}
                                onChange={e => setFormData({...formData, amount: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Catégorie</label>
                            <select 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Utility">Services (Eau/Élec)</option>
                                <option value="Supplies">Fournitures</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Salaries">Salaires</option>
                                <option value="Other">Autre</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input 
                            type="date" 
                            required
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description (Optionnel)</label>
                        <textarea 
                            rows="2"
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

export default Depenses;

