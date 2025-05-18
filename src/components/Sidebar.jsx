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
  const location = useLocation();  // <-- aquí obtienes la ruta actual

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  // Función que retorna "active" si la ruta actual es igual al path del botón
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <aside className="home-sidebar glass">
      <h4 className="sidebar-title">💰 FinTracker</h4>
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

        <button className={`nav-item ${isActive('/presupuestos')}`} onClick={() => navigate('/presupuestos')}>
          <FiTarget className="nav-icon" />
          <span>Presupuestos</span>
        </button>

        <button className={`nav-item ${isActive('/estadisticas')}`} onClick={() => navigate('/estadisticas')}>
          <FiBarChart2 className="nav-icon" />
          <span>Estadísticas</span>
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
