import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../Sidebar';
import { FiEdit, FiDollarSign, FiCalendar, FiList, FiFileText } from 'react-icons/fi';
import '../../styles/nuevoMovimiento.css';

const categories = [
  'Alimentación',
  'Transporte',
  'Salud',
  'Ocio',
  'Trabajo',
  'Otros',
];

const NuevoMovimiento = () => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    type: 'ingreso',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const clientEmail = localStorage.getItem('clientEmail') || 'usuario@example.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.title || !formData.amount || !formData.date || !formData.category) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const movimiento = {
      clientEmail,
      titulo: formData.title,
      cantidad: parseFloat(formData.amount),
      fecha: formData.date,
      categoria: formData.category,
      tipo: formData.type.toUpperCase(), // API espera "INGRESO" o "GASTO"
      descripcion: formData.description || '',
    };

    try {
      setLoading(true);
      await axios.post('http://ec2-54-152-205-216.compute-1.amazonaws.com:8099/api/v1/transactions', movimiento);
      setFeedback({ success: true, message: 'Movimiento guardado correctamente.' });
      setFormData({
        title: '',
        amount: '',
        date: '',
        category: '',
        type: 'ingreso',
        description: '',
      });
    } catch (err) {
      console.error('Error al guardar el movimiento:', err);
      setFeedback({ success: false, message: 'Error al guardar el movimiento.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <Sidebar />

      <main className="home-content fade-in">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Nuevo Movimiento</h2>

        <form className="movement-form" onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div className="form-floating-group">
            <FiEdit className="input-icon" />
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ej. Compra supermercado"
              autoComplete="off"
            />
            <label htmlFor="title">Título *</label>
          </div>

          <div className="form-floating-group">
            <FiDollarSign className="input-icon" />
            <input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="Ej. 50.00"
              autoComplete="off"
            />
            <label htmlFor="amount">Cantidad *</label>
          </div>

          <div className="form-floating-group">
            <FiCalendar className="input-icon" />
            <input
              id="date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <label htmlFor="date">Fecha *</label>
          </div>

          <div className="form-floating-group">
            <FiList className="input-icon" />
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccione --</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <label htmlFor="category">Categoría *</label>
          </div>

          <fieldset>
            <legend>Tipo:</legend>
            <label>
              <input
                type="radio"
                name="type"
                value="ingreso"
                checked={formData.type === 'ingreso'}
                onChange={handleChange}
              />
              Ingreso
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="gasto"
                checked={formData.type === 'gasto'}
                onChange={handleChange}
              />
              Gasto
            </label>
          </fieldset>

          <div className="form-floating-group">
            <FiFileText className="input-icon" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Opcional"
            />
            <label htmlFor="description">Descripción</label>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Movimiento'}
          </button>
        </form>

        {feedback && (
          <div
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: feedback.success ? 'green' : 'red',
            }}
          >
            {feedback.message}
          </div>
        )}
      </main>
    </div>
  );
};

export default NuevoMovimiento;
