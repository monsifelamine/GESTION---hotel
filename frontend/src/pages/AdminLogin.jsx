import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Shield } from 'lucide-react';
import './Login.css';

const AdminLogin = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await api.post('/login', { login, password });
            const { user, token } = res.data;
            
            if (user.role !== 'admin') {
                setError("Cet espace est réservé aux administrateurs.");
                setLoading(false);
                return;
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || 'Email ou mot de passe incorrect.';
            setError(msg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page admin-theme">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-icon large admin">H</div>
                    <h1>HotelManager</h1>
                    <p><Shield size={18} inline /> Administration</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && <div className="login-error">{error}</div>}
                    <div className="form-group">
                        <label>Email Professionnel</label>
                        <input 
                            type="email" 
                            placeholder="nom@hotel.com" 
                            required 
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="login-btn admin" disabled={loading}>
                        {loading ? 'Authentification...' : 'Se connecter'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Accès sécurisé réservé au personnel.</p>
                    <Link to="/login" className="client-link">Retour à l'espace client</Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
