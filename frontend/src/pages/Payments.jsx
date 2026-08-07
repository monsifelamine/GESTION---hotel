import { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Search } from 'lucide-react';
import Modal from '../components/Modal';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [factures, setFactures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        facture_id: '',
        amount: '',
        payment_method: 'cash',
        transaction_id: ''
    });

    const fetchData = async () => {
        try {
            const [resPay, resFac] = await Promise.all([
                api.get('/payments'),
                api.get('/factures')
            ]);
            setPayments(resPay.data);
            setFactures(resFac.data.filter(f => f.status !== 'paid'));
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
            facture_id: '',
            amount: '',
            payment_method: 'cash',
            transaction_id: ''
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.post('/payments', formData);
            fetchData();
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement du paiement");
        }
    };

    const getStatusBadge = (method) => {
        switch (method) {
            case 'credit_card': return 'info';
            case 'cash': return 'success';
            case 'bank_transfer': return 'warning';
            default: return 'secondary';
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="payments">
            <header className="page-header">
                <div>
                    <h1>Paiements</h1>
                    <p>Suivez les règlements de vos clients.</p>
                </div>
                <div className="header-btns">
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        <Plus size={18} /> Nouveau Paiement
                    </button>
                </div>
            </header>

            <div className="card table-card">
                <div className="table-filters">
                    <div className="search-bar">
                        <Search size={18} />
                        <input type="text" placeholder="Rechercher un paiement..." />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Facture</th>
                            <th>Client</th>
                            <th>Montant</th>
                            <th>Méthode</th>
                            <th>Date</th>
                            <th>ID Transaction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td>#{payment.facture_id}</td>
                                <td>
                                    {payment.facture.reservation.client.first_name} {payment.facture.reservation.client.last_name}
                                </td>
                                <td className="font-bold text-success">+{payment.amount} €</td>
                                <td>
                                    <span className={`badge badge-${getStatusBadge(payment.payment_method)}`}>
                                        {payment.payment_method}
                                    </span>
                                </td>
                                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                <td>{payment.transaction_id || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Enregistrer un Paiement"
            >
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Facture</label>
                        <select 
                            required
                            value={formData.facture_id}
                            onChange={e => {
                                const fac = factures.find(f => f.id == e.target.value);
                                setFormData({
                                    ...formData, 
                                    facture_id: e.target.value,
                                    amount: fac ? (fac.total_amount - fac.amount_paid) : ''
                                });
                            }}
                        >
                            <option value="">Sélectionner une facture impayée</option>
                            {factures.map(f => (
                                <option key={f.id} value={f.id}>
                                    Facture #{f.id} - {f.reservation.client.first_name} {f.reservation.client.last_name} (Reste: {f.total_amount - f.amount_paid}€)
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Montant (€)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            required
                            value={formData.amount}
                            onChange={e => setFormData({...formData, amount: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Méthode de Paiement</label>
                        <select 
                            value={formData.payment_method}
                            onChange={e => setFormData({...formData, payment_method: e.target.value})}
                        >
                            <option value="cash">Espèces</option>
                            <option value="credit_card">Carte Bancaire</option>
                            <option value="bank_transfer">Virement</option>
                            <option value="online">En ligne</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>ID Transaction (Optionnel)</label>
                        <input 
                            type="text" 
                            value={formData.transaction_id}
                            onChange={e => setFormData({...formData, transaction_id: e.target.value})}
                        />
                    </div>
                    <div className="modal-footer" style={{ margin: '24px -24px -24px -24px' }}>
                        <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Confirmer le Paiement</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Payments;
