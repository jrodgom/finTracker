// src/components/dashboard/HomeDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiPlusCircle,
  FiTarget,
  FiBarChart2,
  FiLogOut,
} from 'react-icons/fi';
import '../../styles/home.css';

const HomeDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="home-wrapper">
      <aside className="home-sidebar">
        <h4 className="sidebar-title">💰 FinTracker</h4>
        <nav className="sidebar-nav">
          <a href="#">
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </a>
          <a href="#">
            <FiPlusCircle className="nav-icon" />
            <span>Nuevo Movimiento</span>
          </a>
          <a href="#">
            <FiTarget className="nav-icon" />
            <span>Presupuestos</span>
          </a>
          <a href="#">
            <FiBarChart2 className="nav-icon" />
            <span>Estadísticas</span>
          </a>
          <a href="#" className="logout-link" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            <span>Cerrar sesión</span>
          </a>
        </nav>
      </aside>

      <main className="home-content">
        <div className="dashboard-header">
          <h2>Panel de Control</h2>
          <div className="user-info">
            <span>¡Hola, María!</span>
            <img src="https://i.pravatar.cc/40" alt="perfil" />
          </div>
        </div>

        <div className="dashboard-summary">
          <div className="summary-card ingresos">
            <h5>Ingresos</h5>
            <p>$2,500</p>
          </div>
          <div className="summary-card gastos">
            <h5>Gastos</h5>
            <p>$1,400</p>
          </div>
          <div className="summary-card saldo">
            <h5>Saldo</h5>
            <p>$1,100</p>
          </div>
        </div>

        <div className="dashboard-progress">
          <h5>Presupuesto mensual</h5>
          <div className="progress-bar-outer">
            <div className="progress-bar-inner" style={{ width: '70%' }}>
              70% utilizado
            </div>
          </div>
        </div>

        <div className="dashboard-chart">
          <h5>Balance mensual</h5>
          <div className="chart-placeholder">[ Gráfico aquí ]</div>
        </div>

        <div className="dashboard-movements">
          <h5>Movimientos recientes</h5>
          <div className="movement-card">
            <div>
              <strong>Compra supermercado</strong><br />
              <small>Alimentación • 05/05/2025</small>
            </div>
            <span className="gasto">- $60.00</span>
          </div>
          <div className="movement-card">
            <div>
              <strong>Sueldo</strong><br />
              <small>Ingreso • 01/05/2025</small>
            </div>
            <span className="ingreso">+ $2,000.00</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeDashboard;
