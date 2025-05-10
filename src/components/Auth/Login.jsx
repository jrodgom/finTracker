// src/components/Auth/Login.jsx
import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
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
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input type="email" className="form-control" id="email" placeholder="tucorreo@ejemplo.com" />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input type="password" className="form-control" id="password" placeholder="••••••••" />
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
