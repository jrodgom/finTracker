// src/components/NuevoMovimiento.jsx
import React, { useState } from 'react';
import Sidebar from '../Sidebar';
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

  const [movimientos, setMovimientos] = useState([]); // local state para ver resultados

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación sencilla
    if (!formData.title || !formData.amount || !formData.date || !formData.category) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const NuevoMovimiento = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: Date.now(),
    };

    setMovimientos(prev => [NuevoMovimiento, ...prev]);

    alert('Movimiento agregado!');
    // Reset form
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
        <h2>Nuevo Movimiento</h2>
        <form className="movement-form" onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
          <label>
            Título *
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ej. Compra supermercado"
            />
          </label>

          <label>
            Cantidad *
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="Ej. 50.00"
            />
          </label>

          <label>
            Fecha *
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Categoría *
            <select
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
          </label>

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

          <label>
            Descripción
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Opcional"
            />
          </label>

          <button type="submit" className="btn-submit">Guardar Movimiento</button>
        </form>

        {/* Mostrar movimientos agregados para ver que funciona */}
        <section style={{ marginTop: '2rem' }}>
          <h3>Movimientos agregados</h3>
          {movimientos.length === 0 && <p>No hay movimientos aún.</p>}
          {movimientos.map(m => (
            <div key={m.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
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
