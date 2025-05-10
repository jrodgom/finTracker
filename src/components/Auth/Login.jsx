import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../../firebase';
import { useNavigate } from 'react-router-dom'; // Para redirigir después del login
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
  // Estado local para los campos de entrada
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Para navegar después del login exitoso

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpiar el error previo

    try {
      // Llamada a Firebase para iniciar sesión
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); // Redirigir a la página principal
    } catch (error) {
      setError("Error de autenticación. Verifica tu correo y contraseña.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="User avatar"
            className="rounded-circle"
            width="80"
          />
          <h3 className="mt-2">Iniciar Sesión</h3>
        </div>
        {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar errores */}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
