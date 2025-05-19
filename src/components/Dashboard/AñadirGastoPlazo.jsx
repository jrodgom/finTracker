// src/components/dashboard/AñadirGastoPlazo.jsx
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import '../../styles/añadirGastoPlazo.css';

const AñadirGastoPlazo = ({ onCerrar, onGuardar }) => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    valor: '',
    fechaInicio: '',
    fechaFin: '',
    cuotas: '',
    imagen: '',
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (
      !formulario.nombre ||
      !formulario.valor ||
      !formulario.fechaInicio ||
      !formulario.fechaFin ||
      !formulario.cuotas
    ) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    const nuevoGasto = {
      nombre: formulario.nombre,
      valor: parseFloat(formulario.valor),
      fechaInicio: formulario.fechaInicio,
      fechaFin: formulario.fechaFin,
      cuotas: parseInt(formulario.cuotas),
      imagen: formulario.imagen || 'https://via.placeholder.com/100',
    };

    onGuardar(nuevoGasto);
    onCerrar();
  };

  return (
    <div className="ventana-overlay">
      <Sidebar />
      <div className="ventana-contenido">
        <h2>Añadir gasto a plazos</h2>
        <form onSubmit={manejarEnvio} className="formulario-gasto">
          <label>
            Nombre del gasto*:
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ej: iPhone 13 Pro"
              required
            />
          </label>

          <label>
            Valor total (€)*:
            <input
              type="number"
              name="valor"
              value={formulario.valor}
              onChange={manejarCambio}
              min="0"
              step="0.01"
              required
            />
          </label>

          <label>
            Fecha de inicio*:
            <input
              type="date"
              name="fechaInicio"
              value={formulario.fechaInicio}
              onChange={manejarCambio}
              required
            />
          </label>

          <label>
            Fecha de finalización*:
            <input
              type="date"
              name="fechaFin"
              value={formulario.fechaFin}
              onChange={manejarCambio}
              required
            />
          </label>

          <label>
            Número de cuotas*:
            <input
              type="number"
              name="cuotas"
              value={formulario.cuotas}
              onChange={manejarCambio}
              min="1"
              required
            />
          </label>

          <label>
            URL de imagen (opcional):
            <input
              type="url"
              name="imagen"
              value={formulario.imagen}
              onChange={manejarCambio}
              placeholder="https://..."
            />
          </label>

          <div className="botones-formulario">
            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" className="btn-cancelar" onClick={onCerrar}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AñadirGastoPlazo;
