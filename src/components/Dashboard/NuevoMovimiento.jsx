import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { FiEdit, FiDollarSign, FiCalendar, FiList, FiFileText } from 'react-icons/fi';
import '../../styles/NuevoMovimiento.css';

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

  const [movimientos, setMovimientos] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.date || !formData.category) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const nuevoMovimiento = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now(),
    };

    setMovimientos(prev => [nuevoMovimiento, ...prev]);

    alert('Movimiento agregado!');

    setFormData({
      title: '',
      amount: '',
      date: '',
      category: '',
      type: 'ingreso',
      description: '',
    });
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
            <legend>Tipo *</legend>
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

          <button type="submit" className="btn-submit">Guardar Movimiento</button>
        </form>

        <section style={{ marginTop: '2rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h3>Movimientos agregados</h3>
          {movimientos.length === 0 && <p>No hay movimientos aún.</p>}
          {movimientos.map(m => (
            <div key={m.id} className="movement-item">
              <strong>{m.title}</strong> - {m.type === 'ingreso' ? '+' : '-'} ${m.amount.toFixed(2)} <br />
              <small>{m.category} • {m.date}</small><br />
              <em>{m.description}</em>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default NuevoMovimiento;
