import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import '../../styles/home.css';

const formatDateEU = (d) => new Date(d).toLocaleDateString('es-ES');
const formatCurrency = (v) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);

const HomeDashboard = () => {
  const [ingresos, setIngresos] = useState(0), [gastos, setGastos] = useState(0), [loading, setLoading] = useState(true);
  const [movimientos, setMovimientos] = useState([]), [gastosPlazos, setGastosPlazos] = useState([]);
  const clientEmail = localStorage.getItem('clientEmail') || '', clientName = localStorage.getItem('clientName') || 'Usuario';
  const fechaActual = new Date(), [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.get('http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions');
        const transaccionesMes = data.filter(t => t.clientEmail === clientEmail && new Date(t.fecha).getMonth() === fechaActual.getMonth() && new Date(t.fecha).getFullYear() === fechaActual.getFullYear());
        setIngresos(transaccionesMes.filter(t => t.tipo === 'INGRESO').reduce((s, t) => s + t.cantidad, 0));
        setGastos(transaccionesMes.filter(t => t.tipo === 'GASTO').reduce((s, t) => s + t.cantidad, 0));
        setMovimientos(transaccionesMes);
      } catch (err) { console.error('Error obteniendo transacciones:', err); } finally { setLoading(false); }
    };

    const fetchGastosPlazos = async () => {
      try {
        const { data } = await axios.get('http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/installments');
        setGastosPlazos(data.filter(g => g.clientEmail === clientEmail));
      } catch (err) { console.error('Error obteniendo gastos a plazos:', err); }
    };

    if (clientEmail) { fetchTransactions(); fetchGastosPlazos(); } else { setLoading(false); }
  }, [clientEmail, shouldReload]);

  const saldo = ingresos - gastos, daysInMonth = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({ label: String(i + 1).padStart(2, '0'), ingresos: 0, gastos: 0, saldo: 0 }));

  movimientos.forEach((m) => {
    const i = new Date(m.fecha).getDate() - 1;
    if (m.tipo === 'INGRESO') dailyData[i].ingresos += m.cantidad;
    else if (m.tipo === 'GASTO') dailyData[i].gastos += m.cantidad;
  });

  let acumulado = 0;
  dailyData.forEach((d) => { acumulado += d.ingresos - d.gastos; d.saldo = acumulado; });

  const gastosConCalculos = gastosPlazos.map((g) => {
    const inicio = new Date(g.fechaInicio), fin = new Date(g.fechaFin);
    const totalMeses = Math.ceil((fin.getFullYear() - inicio.getFullYear()) * 12 + fin.getMonth() - inicio.getMonth() + 1) || g.cuotas;
    const cuota = g.valor / g.cuotas;
    let pagados = (fechaActual.getFullYear() - inicio.getFullYear()) * 12 + fechaActual.getMonth() - inicio.getMonth() + 1;
    pagados = Math.min(Math.max(pagados, 0), totalMeses);
    const acumulado = +(cuota * pagados).toFixed(2), restante = +(g.valor - acumulado).toFixed(2);
    return { ...g, cuotaMensual: cuota, totalMeses, mesesPagados: pagados, acumulado, restante, progreso: Math.round((acumulado / g.valor) * 100), fechaInicioFormatted: formatDateEU(g.fechaInicio), fechaFinFormatted: formatDateEU(g.fechaFin) };
  });

  return (
    <div className="home-wrapper">
      <Sidebar />
      <main className="home-content fade-in">
        <div className="dashboard-header">
          <h2>Panel de Control</h2>
          <div className="user-info">
            <span>{clientName}</span>
            <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png" alt="Icono de perfil" />
          </div>
        </div>

        <div className="dashboard-summary">
          <Link to="/ingresos" className="summary-card ingresos float-up">
            <h5>Ingresos</h5>
            <p>{loading ? 'Cargando...' : formatCurrency(ingresos)}</p>
          </Link>
          <Link to="/gastos" className="summary-card gastos float-up">
            <h5>Gastos</h5>
            <p>{loading ? 'Cargando...' : formatCurrency(gastos)}</p>
          </Link>
          <div className="summary-card saldo float-up">
            <h5>Saldo</h5>
            <p>{loading ? 'Cargando...' : formatCurrency(saldo)}</p>
          </div>
        </div>

        <div className="dashboard-movements fade-in">
          <h5>Movimientos recientes</h5>
          {loading ? <p>Cargando movimientos...</p> :
            movimientos.length === 0 ? <p>No hay movimientos este mes.</p> :
            movimientos.slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 3).map((m, i) => (
              <Link to="/movimientos" key={i} className="movement-card-link">
                <div className="movement-card">
                  <div>
                    <strong>{m.titulo || m.tipo}</strong><br />
                    <small>{m.tipo[0] + m.tipo.slice(1).toLowerCase()} • {formatDateEU(m.fecha)}</small>
                    {m.descripcion && <><br /><small>Descripción: {m.descripcion}</small></>}
                    {m.categoria && <><br /><small>Categoría: {m.categoria}</small></>}
                  </div>
                  <span className={m.tipo === 'GASTO' ? 'gasto' : 'ingreso'}>
                    {m.tipo === 'GASTO' ? '- ' : '+ '}{formatCurrency(m.cantidad)}
                  </span>
                </div>
              </Link>
            ))}            
        </div>

        <div className="dashboard-plazos fade-in">
          <h5>Gastos a Plazos</h5>
          {gastosConCalculos.length === 0 ? <p>No hay gastos a plazos registrados.</p> :
            <div className="plazos-container">
              {gastosConCalculos.map((g, i) => (
                <div className="plazo-card" key={i}>
                  {g.imagen && <img src={g.imagen} alt={`Imagen de ${g.nombre}`} className="plazo-image" />}
                  <div className="plazo-info">
                    <strong>{g.nombre}</strong>
                    <p>Valor total: {formatCurrency(g.valor)}</p>
                    <p>Inicio: {g.fechaInicioFormatted}</p>
                    <p>Fin estimado: {g.fechaFinFormatted}</p>
                    <p>Importe acumulado: {formatCurrency(g.acumulado)}</p>
                    <p>Restante por pagar: {formatCurrency(g.restante)}</p>
                    <p>Cuota mensual: {formatCurrency(g.cuotaMensual)}</p>
                    <div className="progress-bar-outer">
                      <div className="progress-bar-inner progress-animate" style={{ width: `${g.progreso}%` }}>
                        {g.progreso}% pagado
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>}
        </div>

        <h5>Resumen del mes</h5>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `€${v}`} />
              <Tooltip formatter={(v) => formatCurrency(v)} labelFormatter={(l) => `Día ${l}`} />
              <Line type="monotone" dataKey="saldo" stroke="#82ca9d" strokeWidth={3} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default HomeDashboard;
