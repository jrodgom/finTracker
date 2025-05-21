import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import '../../styles/clientes.css'; // nuevo archivo de estilos

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:8098/api/v1/clientes');
        if (!response.ok) throw new Error('Error al obtener los clientes');
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error cargando clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleEditar = (id) => {
    console.log('Editar cliente con ID:', id);
    // Aquí puedes navegar a una página de edición, por ejemplo:
    // navigate(`/clientes/editar/${id}`);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (!confirmar) return;

    try {
      const response = await fetch(`http://localhost:8098/api/v1/clientes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar el cliente');

      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
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
                <div key={cliente.id} className="cliente-card">
                  <div className="cliente-info">
                    <strong>{cliente.nombre} {cliente.apellidos}</strong>
                    <p>📧 {cliente.correo}</p>
                    {cliente.fechaCreacion && (
                      <p>📅 Creado: {new Date(cliente.fechaCreacion).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="cliente-actions">
                    <button className="btn-editar" onClick={() => handleEditar(cliente.id)}>
                      ✏️ Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(cliente.id)}>
                      🗑️ Eliminar
                    </button>
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
