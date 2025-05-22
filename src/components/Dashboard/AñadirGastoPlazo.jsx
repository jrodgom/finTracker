import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import {
  FiEdit,
  FiDollarSign,
  FiCalendar,
  FiList,
  FiImage
} from 'react-icons/fi';
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
    <div className="gastoPlazo-wrapper">
      <Sidebar />

      <main className="gastoPlazo-content fade-in">

        <form className="gastoPlazo-form" onSubmit={manejarEnvio}>
          <h2 className="gastoPlazo-title">Añadir Gasto a Plazos</h2>
          <div className="gastoPlazo-floating-group">
            <FiEdit className="input-icon" />
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ej: iPhone 13 Pro"
              required
            />
            <label>Nombre del gasto *</label>
          </div>

          <div className="gastoPlazo-floating-group">
            <FiDollarSign className="input-icon" />
            <input
              type="number"
              name="valor"
              value={formulario.valor}
              onChange={manejarCambio}
              min="0"
              step="0.01"
              placeholder="Ej: 999.99"
              required
            />
            <label>Valor total (€) *</label>
          </div>

          <div className="gastoPlazo-floating-group">
            <FiCalendar className="input-icon" />
            <input
              type="date"
              name="fechaInicio"
              value={formulario.fechaInicio}
              onChange={manejarCambio}
              required
            />
            <label>Fecha de inicio *</label>
          </div>

          <div className="gastoPlazo-floating-group">
            <FiCalendar className="input-icon" />
            <input
              type="date"
              name="fechaFin"
              value={formulario.fechaFin}
              onChange={manejarCambio}
              required
            />
            <label>Fecha de finalización *</label>
          </div>

          <div className="gastoPlazo-floating-group">
            <FiList className="input-icon" />
            <input
              type="number"
              name="cuotas"
              value={formulario.cuotas}
              onChange={manejarCambio}
              min="1"
              placeholder="Ej: 12"
              required
            />
            <label>Número de cuotas *</label>
          </div>

          <div className="gastoPlazo-floating-group">
            <FiImage className="input-icon" />
            <input
              type="url"
              name="imagen"
              value={formulario.imagen}
              onChange={manejarCambio}
              placeholder="https://..."
            />
            <label>URL de imagen (opcional)</label>
          </div>

          <div className="gastoPlazo-botones">
            <button type="submit" className="btn-submit">Guardar</button>
            <button type="button" className="btn-cancelar" onClick={onCerrar}>Cancelar</button>
          </div>
        </form>
      </main>
    </div>
  );

};

export default AñadirGastoPlazo;
