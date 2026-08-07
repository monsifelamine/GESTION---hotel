import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search, Edit2, Trash2, Filter, Eye } from 'lucide-react';
import Modal from '../components/Modal';

const Factures = () => {
    const [factures, setFactures] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        reservation_id: '',
        due_date: '',
        status: 'unpaid'
    });

    const fetchData = async () => {
        try {
            const [resFac, resRes] = await Promise.all([
                api.get('/factures'),
                api.get('/reservations')
            ]);
            setFactures(resFac.data);
            // Only reservations without factures
            const reservationsWithFacture = resFac.data.map(f => f.reservation_id);
            setReservations(resRes.data.filter(r => !reservationsWithFacture.includes(r.id)));
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setFormData({
            reservation_id: '',
            due_date: new Date().toISOString().split('T')[0],
            status: 'unpaid'
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.post('/factures', formData);
            fetchData();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création de la facture");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid': return 'success';
            case 'partially_paid': return 'warning';
            case 'unpaid': return 'danger';
            default: return 'secondary';
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="factures">
            <header className="page-header">
                <div>
                    <h1>Factures</h1>
                    <p>Gérez les factures et le suivi des paiements.</p>
                </div>
                <div className="header-btns">
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        <Plus size={18} /> Nouvelle Facture
                    </button>
                </div>
            </header>

            <div className="card table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Rechercher une facture..." />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>N° Facture</th>
                            <th>N° Res.</th>
                            <th>Client</th>
                            <th>Montant Total</th>
                            <th>Payé</th>
                            <th>Échéance</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {factures.map((facture) => (
                            <tr key={facture.id}>
                                <td>#{facture.id}</td>
                                <td>#{facture.reservation_id}</td>
                                <td>
                                    {facture.reservation.client.first_name} {facture.reservation.client.last_name}
                                </td>
                                <td>{facture.total_amount} €</td>
                                <td className="text-success">{facture.amount_paid} €</td>
                                <td>{new Date(facture.due_date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`badge badge-${getStatusBadge(facture.status)}`}>
                                        {facture.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="icon-btn" title="Voir">
                                            <Eye size={16} />
                                        </button>
                                        <button className="icon-btn text-danger" title="Supprimer">
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
                title="Créer une Facture"
            >
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Réservation</label>
                        <select 
                            required
                            value={formData.reservation_id}
                            onChange={e => setFormData({...formData, reservation_id: e.target.value})}
                        >
                            <option value="">Sélectionner une réservation sans facture</option>
                            {reservations.map(r => (
                                <option key={r.id} value={r.id}>
                                    Res #{r.id} - {r.client.first_name} {r.client.last_name} ({r.total_price}€)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Date d'échéance</label>
                        <input 
                            type="date" 
                            required
                            value={formData.due_date}
                            onChange={e => setFormData({...formData, due_date: e.target.value})}
                        />
                    </div>
                    <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Créer la Facture</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Factures;

