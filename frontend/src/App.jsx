import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Rooms from './pages/Rooms';
import Reservations from './pages/Reservations';
import Payments from './pages/Payments';
import Factures from './pages/Factures';
import Depenses from './pages/Depenses';
import Settings from './pages/Settings';
import ClientLogin from './pages/ClientLogin';
import AdminLogin from './pages/AdminLogin';
import './App.css';

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/'} />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page (merged with Client Portal) */}
        <Route path="/" element={<ClientLogin />} />
        <Route path="/login" element={<ClientLogin />} />
        <Route path="/register" element={<ClientLogin />} />
        
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute role="admin"><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="payments" element={<Payments />} />
          <Route path="factures" element={<Factures />} />
          <Route path="depenses" element={<Depenses />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Client Portal Route (in case some links still point there) */}
        <Route path="/client/portal" element={<Navigate to="/" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

