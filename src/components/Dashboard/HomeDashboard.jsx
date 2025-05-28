import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../../styles/home.css';

const formatDateEU = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);

const HomeDashboard = () => {
  const [ingresos, setIngresos] = useState(0);
  const [gastos, setGastos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [movimientos, setMovimientos] = useState([]);

  const fechaActual = new Date();
  const clientEmail = localStorage.getItem('clientEmail') || '';
  const clientName = localStorage.getItem('clientName') || 'Usuario';
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions');
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

        const movimientosOrdenados = [...transaccionesMes]
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 3);

        setMovimientos(transaccionesMes); // guardamos todos los movimientos del mes
      } catch (err) {
        console.error('Error obteniendo transacciones:', err);
      } finally {
        setLoading(false);
      }
    };

    if (clientEmail) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [clientEmail, shouldReload]);

  const saldo = ingresos - gastos;

  // Generar datos para gráfico diario
  const daysInMonth = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      label: String(day).padStart(2, '0'),
      ingresos: 0,
      gastos: 0,
      saldo: 0,
    };
  });

  movimientos.forEach((mov) => {
    const movDate = new Date(mov.fecha);
    const day = movDate.getDate();
    const index = day - 1;
    if (mov.tipo === 'INGRESO') {
      dailyData[index].ingresos += mov.cantidad;
    } else if (mov.tipo === 'GASTO') {
      dailyData[index].gastos += mov.cantidad;
    }
  });

  let acumulado = 0;
  dailyData.forEach((day) => {
    acumulado += day.ingresos - day.gastos;
    day.saldo = acumulado;
  });

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

    const totalMeses = Math.ceil(
      (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 +
      fechaFin.getMonth() - fechaInicio.getMonth() + 1
    ) || gasto.cuotas;

    const cuotaMensual = gasto.valor / gasto.cuotas;

    let mesesPagados =
      (fechaActual.getFullYear() - fechaInicio.getFullYear()) * 12 +
      fechaActual.getMonth() - fechaInicio.getMonth() + 1;

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
            <span>{clientName}</span>
            <img
              src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
              alt="Icono de perfil"
            />
          </div>
        </div>

        <div className="dashboard-summary">
          <div className="summary-card ingresos float-up">
            <h5>Ingresos</h5>
            <p>{loading ? 'Cargando...' : formatCurrency(ingresos)}</p>
          </div>
          <div className="summary-card gastos float-up">
            <h5>Gastos</h5>
            <p>{loading ? 'Cargando...' : formatCurrency(gastos)}</p>
          </div>
          <div className="summary-card saldo float-up">
            <h5>Saldo</h5>
            <p>{loading ? 'Cargando...' : formatCurrency(saldo)}</p>
          </div>
        </div>

        <div className="dashboard-movements fade-in">
          <h5>Movimientos recientes</h5>
          {loading ? (
            <p>Cargando movimientos...</p>
          ) : movimientos.length === 0 ? (
            <p>No hay movimientos este mes.</p>
          ) : (
            movimientos
              .slice()
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .slice(0, 3)
              .map((mov, idx) => (
                <div className="movement-card" key={idx}>
                  <div>
                    <strong>{mov.titulo || mov.tipo}</strong>
                    <br />
                    <small>
                      {mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1)} • {formatDateEU(mov.fecha)}
                    </small>
                    {mov.descripcion && (
                      <>
                        <br />
                        <small>Descripción: {mov.descripcion}</small>
                      </>
                    )}
                    {mov.categoria && (
                      <>
                        <br />
                        <small>Categoría: {mov.categoria}</small>
                      </>
                    )}
                  </div>
                  <span className={mov.tipo === 'GASTO' ? 'gasto' : 'ingreso'}>
                    {mov.tipo === 'GASTO' ? '- ' : '+ '}
                    {formatCurrency(mov.cantidad)}
                  </span>
                </div>
              ))
          )}
        </div>

        <div className="dashboard-plazos fade-in">
          <h5>Gastos a Plazos</h5>
          <div className="plazos-container">
            {gastosConCalculos.map((gasto, idx) => (
              <div className="plazo-card" key={idx}>
                <img src={gasto.imagen} alt={`Imagen de ${gasto.nombre}`} className="plazo-image" />
                <div className="plazo-info">
                  <strong>{gasto.nombre}</strong>
                  <p>Valor total: {formatCurrency(gasto.valor)}</p>
                  <p>Inicio: {gasto.fechaInicioFormatted}</p>
                  <p>Fin estimado: {gasto.fechaFinFormatted}</p>
                  <p>Importe acumulado: {formatCurrency(gasto.acumulado)}</p>
                  <p>Restante por pagar: {formatCurrency(gasto.restante)}</p>
                  <p>Cuota mensual: {formatCurrency(gasto.cuotaMensual)}</p>
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

        <h5>Resumen del mes</h5>
        <div className="chart-container" style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `€${value}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(label) => `Día ${label}`} />
              <Line type="monotone" dataKey="saldo" stroke="#82ca9d" strokeWidth={3} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default HomeDashboard;
