import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import '../../styles/nuevoMovimiento.css'; // reutilizamos el estilo

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Simulamos carga de clientes; sustituye con llamada real a tu API si la tienes
    const fetchClientes = async () => {
      const data = [
        {
          id: '1',
          nombre: 'Juan Pérez',
          apellidos: 'Pérez Gómez',
          correo: 'juan@example.com',
          uidFirebase: 'abc123',
        },
        {
          id: '2',
          nombre: 'Ana García',
          apellidos: 'García López',
          correo: 'ana@example.com',
          uidFirebase: 'def456',
        },
        {
          id: '3',
          nombre: 'Prueba enrique',
          apellidos: 'enriquito',
          correo: 'enriquecabreado@gmail.com',
          uidFirebase: null,
        },
      ];

      setClientes(data);
    };

    fetchClientes();
  }, []);

  return (
    <div className="home-wrapper">
      <Sidebar />
      <main className="home-content fade-in">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Lista de Clientes</h2>

        <section style={{ maxWidth: '600px', margin: '0 auto' }}>
          {clientes.length === 0 ? (
            <p>No hay clientes registrados.</p>
          ) : (
            <div className="movement-form" style={{ padding: '2rem' }}>
              {clientes.map((cliente) => (
                <div key={cliente.id} className="movement-item">
                  <strong>{cliente.nombre} {cliente.apellidos}</strong><br />
                  <span>📧 {cliente.correo}</span><br />
                  <span>🔑 UID Firebase: {cliente.uidFirebase || 'No asignado'}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ClientesPage;
