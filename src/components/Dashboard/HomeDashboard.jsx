// src/components/dashboard/HomeDashboard.jsx
import React from 'react';
import Sidebar from '../Sidebar';
import '../../styles/home.css';

const HomeDashboard = () => {
  return (
    <div className="home-wrapper">
      <Sidebar />

      <main className="home-content fade-in">
        <div className="dashboard-header">
          <h2>Panel de Control</h2>
          <div className="user-info">
            <span>usuario</span>
            <img src="https://i.pravatar.cc/40" alt="perfil" />
          </div>
        </div>

        <div className="dashboard-summary">
          <div className="summary-card ingresos float-up">
            <h5>Ingresos</h5>
            <p>$2,500</p>
          </div>
          <div className="summary-card gastos float-up">
            <h5>Gastos</h5>
            <p>$1,400</p>
          </div>
          <div className="summary-card saldo float-up">
            <h5>Saldo</h5>
            <p>$1,100</p>
          </div>
        </div>

        <div className="dashboard-progress fade-in">
          <h5>Presupuesto mensual</h5>
          <div className="progress-bar-outer">
            <div className="progress-bar-inner progress-animate" style={{ width: '70%' }}>
              70% utilizado
            </div>
          </div>
        </div>

        <h5>Balance mensual</h5>
        <div className="chart-placeholder">[ Gráfico aquí ]</div>

        <div className="dashboard-movements fade-in">
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
