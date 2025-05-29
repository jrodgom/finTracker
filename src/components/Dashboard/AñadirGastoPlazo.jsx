import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import {
  FiEdit,
  FiDollarSign,
  FiCalendar,
  FiList,
  FiImage
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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

  const [mensaje, setMensaje] = useState(null); // para el toast
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'exito' o 'error'
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    const { nombre, valor, fechaInicio, fechaFin, cuotas, imagen } = formulario;

    if (!nombre || !valor || !fechaInicio || !cuotas) {
      setMensaje('Por favor, completa todos los campos obligatorios.');
      setTipoMensaje('error');
      return;
    }

    const nuevoGasto = {
      titulo: nombre,
      cantidad: parseFloat(valor),
      fecha: fechaInicio,
      totalCuotas: parseInt(cuotas, 10),
      descripcion: "Compra a plazos"
    };

    try {
      const response = await axios.post(
        'http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/installments',
        nuevoGasto,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Respuesta del servidor:', response.data);

      if (onGuardar) onGuardar(response.data);

      setMensaje('¡Gasto guardado correctamente!');
      setTipoMensaje('exito');

      setTimeout(() => {
        navigate('/home');
      }, 2000); // Espera 2 segundos antes de redirigir

    } catch (error) {
      console.error('Error al guardar el gasto:', error.response || error);
      setMensaje('Hubo un error al guardar el gasto.');
      setTipoMensaje('error');
    }
  };

  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

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

        {mensaje && (
          <div className={`toast-${tipoMensaje}`}>
            <i className={`bi ${tipoMensaje === 'exito' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} toast-icon`}></i>
            {mensaje}
          </div>
        )}
      </main>
    </div>
  );
};

export default AñadirGastoPlazo;
