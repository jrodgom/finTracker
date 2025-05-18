// src/components/common/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <aside className="home-sidebar glass">
      <h4 className="sidebar-title">💰 FinTracker</h4>
      <nav className="sidebar-nav">
        <button className="nav-item active" onClick={() => navigate('/home')}>
          <FiHome className="nav-icon" />
          <span>Dashboard</span>
        </button>
        <button className="nav-item" onClick={() => navigate('/nuevo')}>
          <FiPlusCircle className="nav-icon" />
          <span>Nuevo Movimiento</span>
        </button>
        <button className="nav-item">
          <FiTarget className="nav-icon" />
          <span>Presupuestos</span>
        </button>
        <button className="nav-item">
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
