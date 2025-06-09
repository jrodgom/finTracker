import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import '../../styles/ingresos.css';

const formatDateEU = (d) => new Date(d).toLocaleDateString('es-ES');
const formatCurrency = (v) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v);

const Ingresos = () => {
  const [ingresos, setIngresos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const clientEmail = localStorage.getItem('clientEmail') || '';

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const response = await fetch('http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions');
        if (!response.ok) throw new Error('Error al obtener los ingresos');
        const data = await response.json();
        const ingresosCliente = data.filter(t => t.clientEmail === clientEmail && t.tipo === 'INGRESO');
        setIngresos(ingresosCliente);
      } catch (error) {
        console.error('Error cargando ingresos:', error);
      }
    };
    fetchIngresos();
  }, [clientEmail]);

  const handleEditar = (ingreso) => {
    setEditandoId(ingreso.id);
    setFormData({
      titulo: ingreso.titulo || '',
      descripcion: ingreso.descripcion || '',
      cantidad: ingreso.cantidad || 0,
      fecha: ingreso.fecha ? new Date(ingreso.fecha).toISOString().slice(0, 10) : '',
      categoria: ingreso.categoria || '',
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
          tipo: 'INGRESO',
          clientEmail,
        }),
      });
      if (!response.ok) throw new Error('Error al guardar los cambios');
      setIngresos(prev => prev.map(ing => ing.id === id ? { ...ing, ...formData, cantidad: parseFloat(formData.cantidad) } : ing));
      setEditandoId(null);
    } catch (error) {
      console.error('Error guardando cambios:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este ingreso?')) return;
    try {
      const response = await fetch(`http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar el ingreso');
      setIngresos(prev => prev.filter(ing => ing.id !== id));
    } catch (error) {
      console.error('Error al eliminar ingreso:', error);
    }
  };

  return (
    <div className="ingresos-wrapper">
      <Sidebar />
      <main className="ingresos-content">
        <h2 className="ingresos-title">Lista de Ingresos</h2>
        <section className="ingresos-list-section">
          {ingresos.length === 0 ? (
            <p className="ingresos-empty">No hay ingresos registrados.</p>
          ) : (
            <div className="ingresos-list">
              {ingresos.map((ingreso) => (
                <div key={ingreso.id} className="ingresos-card">
                  {editandoId === ingreso.id ? (
                    <div className="ingresos-info">
                      <input type="text" name="titulo" value={formData.titulo} onChange={handleInputChange} placeholder="Título" />
                      <input type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} placeholder="Descripción" />
                      <input type="number" name="cantidad" value={formData.cantidad} onChange={handleInputChange} placeholder="Cantidad" step="0.01" />
                      <input type="date" name="fecha" value={formData.fecha} onChange={handleInputChange} />
                      <input type="text" name="categoria" value={formData.categoria} onChange={handleInputChange} placeholder="Categoría" />
                    </div>
                  ) : (
                    <div className="ingresos-info">
                      <strong>{ingreso.titulo}</strong>
                      <p>Descripción: {ingreso.descripcion || '-'}</p>
                      <p>Cantidad: {formatCurrency(ingreso.cantidad)}</p>
                      <p>Fecha: {formatDateEU(ingreso.fecha)}</p>
                      <p>Categoría: {ingreso.categoria || '-'}</p>
                    </div>
                  )}
                  <div className="ingresos-actions">
                    {editandoId === ingreso.id ? (
                      <>
                        <button className="ingresos-btn-editar" onClick={() => handleGuardar(ingreso.id)}>💾 Guardar</button>
                        <button className="ingresos-btn-eliminar" onClick={handleCancelar}>❌ Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button className="ingresos-btn-editar" onClick={() => handleEditar(ingreso)}>✏️ Editar</button>
                        <button className="ingresos-btn-eliminar" onClick={() => handleEliminar(ingreso.id)}>🗑️ Eliminar</button>
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

export default Ingresos;