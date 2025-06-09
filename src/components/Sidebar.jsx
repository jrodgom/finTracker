import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiPlusCircle,
  FiTarget,
  FiBarChart2,
  FiLogOut,
} from 'react-icons/fi';
import '../styles/sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="home-sidebar glass">
      <h4 className="sidebar-title">FinTracker</h4>
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${isActive('/home')}`}
          onClick={() => navigate('/home')}
        >
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${isActive('/nuevo')}`}
          onClick={() => navigate('/nuevo')}
        >
          <FiPlusCircle className="nav-icon" />
          <span>Nuevo Movimiento</span>
        </button>

        <button
          className={`nav-item ${isActive('/presupuestos')}`}
          onClick={() => navigate('/nuevo-gasto-plazo')}
        >
          <FiTarget className="nav-icon" />
          <span>Gastos a Plazos</span>
        </button>

        <button
          className={`nav-item ${isActive('/clientes')}`}
          onClick={() => navigate('/clientes')}
        >
          <FiBarChart2 className="nav-icon" />
          <span>Clientes</span>
        </button>

        <button className="nav-item logout-link" onClick={handleLogout}>
          <FiLogOut className="nav-icon" />
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
