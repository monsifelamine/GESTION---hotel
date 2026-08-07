import { useState } from 'react';
import { Save, User, Building, Shield, Bell } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('hotel');
    const [hotelData, setHotelData] = useState({
        name: 'Hotel Manager Pro',
        address: '123 Boulevard Hassan II, Casablanca',
        email: 'contact@hotelpro.ma',
        phone: '+212 522 00 00 00',
        currency: 'MAD'
    });

    const [userData, setUserData] = useState({
        name: 'Admin Hotel',
        email: 'admin@hotel.com',
        currentPassword: '',
        newPassword: ''
    });

    const handleSaveHotel = (e) => {
        e.preventDefault();
        alert('Paramètres de l\'hôtel enregistrés !');
    };

    const handleSaveUser = (e) => {
        e.preventDefault();
        alert('Profil administrateur mis à jour !');
    };

    return (
        <div className="settings">
            <header className="page-header">
                <div>
                    <h1>Paramètres</h1>
                    <p>Configurez les détails de votre hôtel et de votre compte.</p>
                </div>
            </header>

            <div className="card settings-container" style={{ display: 'flex', gap: '32px', padding: 0, minHeight: '500px' }}>
                <aside className="settings-sidebar" style={{ width: '240px', borderRight: '1px solid var(--border)', padding: '24px' }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button 
                            className={`btn-settings ${activeTab === 'hotel' ? 'active' : ''}`}
                            onClick={() => setActiveTab('hotel')}
                        >
                            <Building size={18} /> Hôtel
                        </button>
                        <button 
                            className={`btn-settings ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <User size={18} /> Profil Admin
                        </button>
                        <button 
                            className={`btn-settings ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => setActiveTab('security')}
                        >
                            <Shield size={18} /> Sécurité
                        </button>
                    </nav>
                </aside>

                <main className="settings-content" style={{ flex: 1, padding: '32px' }}>
                    {activeTab === 'hotel' && (
                        <form onSubmit={handleSaveHotel}>
                            <h2 style={{ marginBottom: '24px' }}>Informations de l'Hôtel</h2>
                            <div className="form-group">
                                <label>Nom de l'établissement</label>
                                <input 
                                    type="text" 
                                    value={hotelData.name}
                                    onChange={e => setHotelData({...hotelData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Adresse</label>
                                <input 
                                    type="text" 
                                    value={hotelData.address}
                                    onChange={e => setHotelData({...hotelData, address: e.target.value})}
                                />
                            </div>
                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        value={hotelData.email}
                                        onChange={e => setHotelData({...hotelData, email: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input 
                                        type="text" 
                                        value={hotelData.phone}
                                        onChange={e => setHotelData({...hotelData, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ width: '200px' }}>
                                <label>Devise</label>
                                <select 
                                    value={hotelData.currency}
                                    onChange={e => setHotelData({...hotelData, currency: e.target.value})}
                                >
                                    <option value="MAD">Dirham (MAD)</option>
                                    <option value="EUR">Euro (€)</option>
                                    <option value="USD">Dollar ($)</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>
                                <Save size={18} /> Enregistrer les modifications
                            </button>
                        </form>
                    )}

                    {activeTab === 'profile' && (
                        <form onSubmit={handleSaveUser}>
                            <h2 style={{ marginBottom: '24px' }}>Profil Administrateur</h2>
                            <div className="form-group">
                                <label>Nom complet</label>
                                <input 
                                    type="text" 
                                    value={userData.name}
                                    onChange={e => setUserData({...userData, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email de connexion</label>
                                <input 
                                    type="email" 
                                    value={userData.email}
                                    onChange={e => setUserData({...userData, email: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>
                                <Save size={18} /> Mettre à jour le profil
                            </button>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handleSaveUser}>
                            <h2 style={{ marginBottom: '24px' }}>Sécurité & Mot de passe</h2>
                            <div className="form-group">
                                <label>Mot de passe actuel</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                            <div className="form-group">
                                <label>Nouveau mot de passe</label>
                                <input type="password" placeholder="Minimum 8 caractères" />
                            </div>
                            <div className="form-group">
                                <label>Confirmer le mot de passe</label>
                                <input type="password" placeholder="••••••••" />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '24px' }}>
                                <Shield size={18} /> Changer le mot de passe
                            </button>
                        </form>
                    )}
                </main>
            </div>

            <style>{`
                .btn-settings {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-weight: 500;
                    color: var(--text-muted);
                    transition: all 0.2s;
                    background: none;
                    border: none;
                    text-align: left;
                    cursor: pointer;
                }
                .btn-settings:hover {
                    background: var(--bg-main);
                    color: var(--text-main);
                }
                .btn-settings.active {
                    background: var(--accent-bg);
                    color: var(--accent);
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default Settings;
