import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import '../../styles/home.css';

const formatDateEU = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HomeDashboard = () => {
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [loading, setLoading] = useState(true);
  const fechaActual = new Date();
  const clientEmail = localStorage.getItem('clientEmail') || 'usuario@example.com';

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://ec2-54-152-205-216.compute-1.amazonaws.com:8099/api/v1/transactions');
        const todas = res.data;

        const transaccionesMes = todas.filter(
          (t) =>
            t.clientEmail === clientEmail &&
            new Date(t.fecha).getMonth() === fechaActual.getMonth() &&
            new Date(t.fecha).getFullYear() === fechaActual.getFullYear()
        );

        const totalIngresos = transaccionesMes
          .filter((t) => t.tipo === 'INGRESO')
          .reduce((sum, t) => sum + t.cantidad, 0);

        const totalGastos = transaccionesMes
          .filter((t) => t.tipo === 'GASTO')
          .reduce((sum, t) => sum + t.cantidad, 0);

        setIngresos(totalIngresos);
        setGastos(totalGastos);
      } catch (err) {
        console.error('Error obteniendo transacciones:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const saldo = ingresos - gastos;

  // Datos estáticos de ejemplo para gastos a plazos
  const gastosPlazos = [
    {
      nombre: 'iPhone 13 Pro',
      valor: 436,
      fechaInicio: '2025-03-01',
      fechaFin: '2025-05-01',
      cuotas: 3,
      imagen: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-family-hero',
    },
    {
      nombre: 'Televisor 4K',
      valor: 900,
      fechaInicio: '2025-01-15',
      fechaFin: '2025-06-15',
      cuotas: 6,
      imagen: 'https://cdn-icons-png.flaticon.com/512/992/992700.png',
    },
    {
      nombre: 'Ordenador portátil',
      valor: 1200,
      fechaInicio: '2025-02-01',
      fechaFin: '2025-07-01',
      cuotas: 6,
      imagen: 'https://cdn-icons-png.flaticon.com/512/2920/2920216.png',
    },
  ];

  const gastosConCalculos = gastosPlazos.map((gasto) => {
    const fechaInicio = new Date(gasto.fechaInicio);
    const fechaFin = new Date(gasto.fechaFin);

    const totalMeses =
      Math.ceil(
        (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 +
        fechaFin.getMonth() -
        fechaInicio.getMonth() +
        1
      ) || gasto.cuotas;

    const cuotaMensual = gasto.valor / gasto.cuotas;

    let mesesPagados =
      (fechaActual.getFullYear() - fechaInicio.getFullYear()) * 12 +
      fechaActual.getMonth() -
      fechaInicio.getMonth() +
      1;

    mesesPagados = Math.min(Math.max(mesesPagados, 0), totalMeses);

    const acumulado = +(cuotaMensual * mesesPagados).toFixed(2);
    const restante = +(gasto.valor - acumulado).toFixed(2);
    const progreso = Math.round((acumulado / gasto.valor) * 100);

    return {
      ...gasto,
      cuotaMensual,
      totalMeses,
      mesesPagados,
      acumulado,
      restante,
      progreso,
      fechaInicioFormatted: formatDateEU(gasto.fechaInicio),
      fechaFinFormatted: formatDateEU(gasto.fechaFin),
    };
  });

  return (
    <div className="home-wrapper">
      <Sidebar />

      <main className="home-content fade-in">
        <div className="dashboard-header">
          <h2>Panel de Control</h2>
          <div className="user-info">
            <span>{clientEmail}</span>
            <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" alt="perfil" />
          </div>
        </div>

        {/* Resumen de ingresos/gastos/saldo */}
        <div className="dashboard-summary">
          <div className="summary-card ingresos float-up">
            <h5>Ingresos</h5>
            <p>{loading ? 'Cargando...' : `€${ingresos.toFixed(2)}`}</p>
          </div>
          <div className="summary-card gastos float-up">
            <h5>Gastos</h5>
            <p>{loading ? 'Cargando...' : `€${gastos.toFixed(2)}`}</p>
          </div>
          <div className="summary-card saldo float-up">
            <h5>Saldo</h5>
            <p>{loading ? 'Cargando...' : `€${saldo.toFixed(2)}`}</p>
          </div>
        </div>

        {!loading && ingresos === 0 && gastos === 0 && (
          <p className="no-transactions-msg">No hay transacciones este mes.</p>
        )}

        {/* Gastos a plazos */}
        <div className="dashboard-plazos fade-in">
          <h5>Gastos a Plazos</h5>
          <div className="plazos-container">
            {gastosConCalculos.map((gasto, idx) => (
              <div className="plazo-card" key={idx}>
                <img src={gasto.imagen} alt={gasto.nombre} className="plazo-image" />
                <div className="plazo-info">
                  <strong>{gasto.nombre}</strong>
                  <p>Valor total: €{gasto.valor}</p>
                  <p>Inicio: {gasto.fechaInicioFormatted}</p>
                  <p>Fin estimado: {gasto.fechaFinFormatted}</p>
                  <p>Importe acumulado: €{gasto.acumulado}</p>
                  <p>Restante por pagar: €{gasto.restante}</p>
                  <p>Cuota mensual: €{gasto.cuotaMensual.toFixed(2)}</p>
                  <div className="progress-bar-outer">
                    <div
                      className="progress-bar-inner progress-animate"
                      style={{ width: `${gasto.progreso}%` }}
                    >
                      {gasto.progreso}% pagado
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico y movimientos: se actualizarán más adelante */}
        <h5>Balance mensual</h5>
        <div className="chart-placeholder">[ Gráfico aquí ]</div>

        <div className="dashboard-movements fade-in">
          <h5>Movimientos recientes</h5>
          <div className="movement-card">
            <div>
              <strong>Compra supermercado</strong>
              <br />
              <small>Alimentación • 05/05/2025</small>
            </div>
            <span className="gasto">- $60.00</span>
          </div>
          <div className="movement-card">
            <div>
              <strong>Sueldo</strong>
              <br />
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
