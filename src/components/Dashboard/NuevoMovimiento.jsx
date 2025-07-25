import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { FiEdit, FiDollarSign, FiCalendar, FiList, FiFileText } from 'react-icons/fi';
import '../../styles/nuevoMovimiento.css';

const categories = ['Alimentación', 'Transporte', 'Salud', 'Ocio', 'Trabajo', 'Otros'];

const NuevoMovimiento = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: '', amount: '', date: '', category: '', type: 'ingreso', description: '' });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const clientEmail = localStorage.getItem('clientEmail') || 'usuario@example.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const { title, amount, date, category, type, description } = formData;
    if (!title || !amount || !date || !category) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const currentTime = new Date().toTimeString().split(' ')[0];
    const fechaCompleta = new Date(`${date}T${currentTime}`).toISOString();

    const movimiento = {
      clientEmail,
      titulo: title,
      cantidad: parseFloat(amount),
      fecha: fechaCompleta,
      categoria: category,
      tipo: type.toUpperCase(),
      descripcion: description || '',
    };

    try {
      setLoading(true);
      await axios.post('http://fintracker-rgjd.us-east-1.elasticbeanstalk.com:81/api/v1/transactions', movimiento);
      setFeedback({ success: true, message: 'Movimiento guardado correctamente.' });
      setFormData({ title: '', amount: '', date: '', category: '', type: 'ingreso', description: '' });
      setTimeout(() => { navigate('/home'); }, 1000);
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
        <form className="movement-form" onSubmit={handleSubmit}>
          <h2>Nuevo Movimiento</h2>

          <div className="form-floating-group">
            <FiEdit className="input-icon" />
            <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Ej. Compra supermercado" autoComplete="off"/>
            <label htmlFor="title">Título *</label>
          </div>

          <div className="form-floating-group">
            <FiDollarSign className="input-icon" />
            <input id="amount" type="number" name="amount" value={formData.amount} onChange={handleChange} required min="0.01" step="0.01" placeholder="Ej. 50.00" autoComplete="off"/>
            <label htmlFor="amount">Cantidad *</label>
          </div>

          <div className="form-floating-group">
            <FiCalendar className="input-icon" />
            <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required/>
            <label htmlFor="date">Fecha *</label>
          </div>

          <div className="form-floating-group">
            <FiList className="input-icon" />
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option value="">-- Seleccione --</option>
              {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
            <label htmlFor="category">Categoría *</label>
          </div>

          <fieldset>
            <legend>Tipo:</legend>
            <label><input type="radio" name="type" value="ingreso" checked={formData.type === 'ingreso'} onChange={handleChange}/> Ingreso</label>
            <label><input type="radio" name="type" value="gasto" checked={formData.type === 'gasto'} onChange={handleChange}/> Gasto</label>
          </fieldset>

          <div className="form-floating-group">
            <FiFileText className="input-icon" />
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Opcional"/>
            <label htmlFor="description">Descripción</label>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Movimiento'}</button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/home')}>Cancelar</button>
          </div>
        </form>

        {feedback && (
          <div className={`feedback-message ${feedback.success ? 'success' : 'error'}`}>{feedback.message}</div>
        )}
      </main>
    </div>
  );
};

export default NuevoMovimiento;