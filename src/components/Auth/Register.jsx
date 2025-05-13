import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de validación y envío a Firebase
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    console.log({ email, password });
  };

  return (
    <div className="login-container">
      <div className={`login-card ${error ? 'login-error' : ''}`}>
        <div className="login-header">
          <h2>Crear Cuenta</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-floating-group">
            <input
              type="email"
              className="form-input"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="register-email">Correo electrónico</label>
            <i className="bi bi-envelope-fill input-icon"></i>
          </div>

          <div className="form-floating-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="register-password">Contraseña</label>
            <i className="bi bi-lock-fill input-icon lock-icon"></i>
            <i
              className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} input-icon password-toggle`}
              onClick={() => setShowPassword(!showPassword)}
              title="Mostrar/Ocultar contraseña"
            ></i>
          </div>

          <div className="form-floating-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              id="register-confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="register-confirm">Confirmar contraseña</label>
            <i className="bi bi-shield-lock-fill input-icon lock-icon"></i>
          </div>

          <button type="submit" className="btn-primary w-100">Registrarse</button>

          <div className="register-link">
            ¿Ya tienes una cuenta?
            <a className="register-link-text" onClick={() => navigate('/login')}>Inicia sesión</a>
          </div>
        </form>
      </div>

      {error && (
        <div className="toast-error">
          <i className="bi bi-exclamation-circle-fill toast-icon"></i>
          {error}
        </div>
      )}
    </div>
  );
};

export default Register;
