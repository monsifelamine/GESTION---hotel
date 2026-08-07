import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  CalendarCheck, 
  CreditCard, 
  Settings,
  Bell,
  LogOut,
  FileText,
  Wallet
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const navItems = [
        { icon: LayoutDashboard, label: 'Tableau de bord', path: '/' },
        { icon: Users, label: 'Clients', path: '/clients' },
        { icon: BedDouble, label: 'Chambres', path: '/rooms' },
        { icon: CalendarCheck, label: 'Réservations', path: '/reservations' },
        { icon: CreditCard, label: 'Paiements', path: '/payments' },
        { icon: FileText, label: 'Factures', path: '/factures' },
        { icon: Wallet, label: 'Dépenses', path: '/depenses' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">H</div>
                <span>HotelManager</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink 
                        key={item.path} 
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item" onClick={() => navigate('/settings')}>
                    <Settings size={20} />
                    <span>Paramètres</span>
                </button>
                <button className="nav-item text-danger" onClick={() => {
                    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
                        localStorage.clear();
                        navigate('/login');
                    }
                }}>
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
