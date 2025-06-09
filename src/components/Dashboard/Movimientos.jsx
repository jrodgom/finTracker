import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import '../../styles/movimientos.css';

const formatDateEU = (d) => new Date(d).toLocaleDateString('es-ES');
const formatCurrency = (v) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const clientEmail = localStorage.getItem('clientEmail') || '';

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await fetch('http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions');
        if (!response.ok) throw new Error('Error al obtener movimientos');
        const data = await response.json();
        const movimientosCliente = data.filter(t => t.clientEmail === clientEmail);
        setMovimientos(movimientosCliente);
      } catch (error) {
        console.error('Error cargando movimientos:', error);
      }
    };
    fetchMovimientos();
  }, [clientEmail]);

  const handleEditar = (movimiento) => {
    setEditandoId(movimiento.id);
    setFormData({
      titulo: movimiento.titulo || '',
      descripcion: movimiento.descripcion || '',
      cantidad: movimiento.cantidad || 0,
      fecha: movimiento.fecha ? new Date(movimiento.fecha).toISOString().slice(0, 10) : '',
      categoria: movimiento.categoria || '',
      tipo: movimiento.tipo || 'GASTO',
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
          clientEmail,
        }),
      });
      if (!response.ok) throw new Error('Error al guardar los cambios');
      setMovimientos(prev => prev.map(mov => mov.id === id ? { ...mov, ...formData, cantidad: parseFloat(formData.cantidad) } : mov));
      setEditandoId(null);
    } catch (error) {
      console.error('Error guardando cambios:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este movimiento?')) return;
    try {
      const response = await fetch(`http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el movimiento');
      setMovimientos(prev => prev.filter(mov => mov.id !== id));
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
    }
  };

  return (
    <div className="movimientos-wrapper">
      <Sidebar />
      <main className="movimientos-content">
        <h2 className="movimientos-title">Lista de Movimientos</h2>
        <section className="movimientos-list-section">
          {movimientos.length === 0 ? (
            <p className="movimientos-empty">No hay movimientos registrados.</p>
          ) : (
            <div className="movimientos-list">
              {movimientos.map((movimiento) => (
                <div key={movimiento.id} className={`movimientos-card ${movimiento.tipo === 'GASTO' ? 'gasto' : 'ingreso'}`}>
                  {editandoId === movimiento.id ? (
                    <div className="movimientos-info">
                      <input type="text" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título" />
                      <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" />
                      <input type="number" name="cantidad" value={formData.cantidad} onChange={handleInputChange} placeholder="Cantidad" step="0.01" />
                      <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} />
                      <input type="text" name="categoria" value={formData.categoria} onChange={handleInputChange} placeholder="Categoría" />
                      <select name="tipo" value={formData.tipo} onChange={handleInputChange}>
                        <option value="INGRESO">Ingreso</option>
                        <option value="GASTO">Gasto</option>
                      </select>
                    </div>
                  ) : (
                    <div className="movimientos-info">
                      <strong>{movimiento.titulo}</strong>
                      <p>Descripción: {movimiento.descripcion || '-'}</p>
                      <p>Cantidad: {formatCurrency(movimiento.cantidad)}</p>
                      <p>Fecha: {formatDateEU(movimiento.fecha)}</p>
                      <p>Categoría: {movimiento.categoria || '-'}</p>
                      <p>Tipo: {movimiento.tipo === 'INGRESO' ? 'Ingreso' : 'Gasto'}</p>
                    </div>
                  )}
                  <div className="movimientos-actions">
                    {editandoId === movimiento.id ? (
                      <>
                        <button className="movimientos-btn-editar" onClick={() => handleGuardar(movimiento.id)}>💾 Guardar</button>
                        <button className="movimientos-btn-eliminar" onClick={handleCancelar}>❌ Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="movimientos-btn-editar" onClick={() => handleEditar(movimiento)}>✏️ Editar</button>
                        <button className="movimientos-btn-eliminar" onClick={() => handleEliminar(movimiento.id)}>🗑️ Eliminar</button>
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

export default Movimientos;
