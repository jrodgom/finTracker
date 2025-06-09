import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import '../../styles/clientes.css';

const formatDateEU = (d) => new Date(d).toLocaleDateString('es-ES');
const formatCurrency = (v) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const clientEmail = localStorage.getItem('clientEmail') || '';

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const response = await fetch('http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions');
        if (!response.ok) throw new Error('Error al obtener los gastos');
        const data = await response.json();
        const gastosCliente = data.filter(t => t.clientEmail === clientEmail && t.tipo === 'GASTO');
        setGastos(gastosCliente);
      } catch (error) {
        console.error('Error cargando gastos:', error);
      }
    };
    fetchGastos();
  }, [clientEmail]);

  const handleEditar = (gasto) => {
    setEditandoId(gasto.id);
    setFormData({
      titulo: gasto.titulo || '',
      descripcion: gasto.descripcion || '',
      cantidad: gasto.cantidad || 0,
      fecha: gasto.fecha ? new Date(gasto.fecha).toISOString().slice(0, 10) : '',
      categoria: gasto.categoria || '',
    });
  };

  const handleCancelar = () => {
    setEditandoId(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (id) => {
    try {
      const response = await fetch(`http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cantidad: parseFloat(formData.cantidad),
          tipo: 'GASTO',
          clientEmail,
        }),
      });
      if (!response.ok) throw new Error('Error al guardar los cambios');

      setGastos(prev => prev.map(g => g.id === id ? { ...g, ...formData, cantidad: parseFloat(formData.cantidad) } : g));
      setEditandoId(null);
    } catch (error) {
      console.error('Error guardando cambios:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) return;
    try {
      const response = await fetch(`http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el gasto');
      setGastos(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
    }
  };

  return (
    <div className="clientes-wrapper">
      <Sidebar />
      <main className="clientes-content">
        <h2 className="clientes-title">Lista de Gastos</h2>
        <section className="clientes-list-section">
          {gastos.length === 0 ? (
            <p className="clientes-empty">No hay gastos registrados.</p>
          ) : (
            <div className="clientes-list">
              {gastos.map((gasto) => (
                <div key={gasto.id} className="clientes-card">
                  {editandoId === gasto.id ? (
                    <div className="clientes-info">
                      <input type="text" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título" />
                      <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" />
                      <input type="number" name="cantidad" value={formData.cantidad} onChange={handleInputChange} placeholder="Cantidad" step="0.01" />
                      <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} />
                      <input type="text" name="categoria" value={formData.categoria} onChange={handleInputChange} placeholder="Categoría" />
                    </div>
                  ) : (
                    <div className="clientes-info">
                      <strong>{gasto.titulo}</strong>
                      <p>Descripción: {gasto.descripcion || '-'}</p>
                      <p>Cantidad: {formatCurrency(gasto.cantidad)}</p>
                      <p>Fecha: {formatDateEU(gasto.fecha)}</p>
                      <p>Categoría: {gasto.categoria || '-'}</p>
                    </div>
                  )}
                  <div className="clientes-actions">
                    {editandoId === gasto.id ? (
                      <>
                        <button className="clientes-btn-editar" onClick={() => handleGuardar(gasto.id)}>💾 Guardar</button>
                        <button className="clientes-btn-eliminar" onClick={handleCancelar}>❌ Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="clientes-btn-editar" onClick={() => handleEditar(gasto)}>✏️ Editar</button>
                        <button className="clientes-btn-eliminar" onClick={() => handleEliminar(gasto.id)}>🗑️ Eliminar</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Gastos;
