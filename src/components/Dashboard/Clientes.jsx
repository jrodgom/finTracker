import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import '../../styles/clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://ec2-54-152-205-216.compute-1.amazonaws.com:8098/api/v1/clientes');
        if (!response.ok) throw new Error('Error al obtener los clientes');
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleEditar = (cliente) => {
    setEditandoId(cliente.id);
    setFormData({
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      correo: cliente.correo
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
      const response = await fetch(`http://ec2-54-152-205-216.compute-1.amazonaws.com:8098/api/v1/clientes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar los cambios');

      setClientes(prev =>
        prev.map(cliente =>
          cliente.id === id ? { ...cliente, ...formData } : cliente
        )
      );
      setEditandoId(null);
    } catch (error) {
      console.error('Error guardando cambios:', error);
    }
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (!confirmar) return;

    try {
      const response = await fetch(`http://ec2-54-152-205-216.compute-1.amazonaws.com:8098/api/v1/clientes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar el cliente');
      setClientes(prev => prev.filter(cliente => cliente.id !== id));
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  return (
    <div className="clientes-wrapper">
      <Sidebar />
      <main className="clientes-content">
        <h2 className="clientes-title">Lista de Clientes</h2>

        <section className="clientes-list-section">
          {clientes.length === 0 ? (
            <p className="clientes-empty">No hay clientes registrados.</p>
          ) : (
            <div className="clientes-list">
              {clientes.map((cliente) => (
                <div key={cliente.id} className="clientes-card">
                  {editandoId === cliente.id ? (
                    <div className="clientes-info">
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Nombre"
                      />
                      <input
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        placeholder="Apellidos"
                      />
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        placeholder="Correo"
                      />
                    </div>
                  ) : (
                    <div className="clientes-info">
                      <strong>{cliente.nombre} {cliente.apellidos}</strong>
                      <p>📧 {cliente.correo}</p>
                      {cliente.fechaCreacion && (
                        <p>📅 Creado: {new Date(cliente.fechaCreacion).toLocaleDateString()}</p>
                      )}
                    </div>
                  )}

                  <div className="clientes-actions">
                    {editandoId === cliente.id ? (
                      <>
                        <button className="clientes-btn-editar" onClick={() => handleGuardar(cliente.id)}>
                          💾 Guardar
                        </button>
                        <button className="clientes-btn-eliminar" onClick={handleCancelar}>
                          ❌ Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="clientes-btn-editar" onClick={() => handleEditar(cliente)}>
                          ✏️ Editar
                        </button>
                        <button className="clientes-btn-eliminar" onClick={() => handleEliminar(cliente.id)}>
                          🗑️ Eliminar
                        </button>
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

export default Clientes;
