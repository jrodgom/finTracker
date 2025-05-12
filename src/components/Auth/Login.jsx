// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      setError("Error al iniciar sesión con Google.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      setError("Error de autenticación. Verifica tu correo y contraseña.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="User avatar"
            className="login-avatar"
          />
          <h2>Iniciar Sesión</h2>
        </div>

        {error && <div className="alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-floating-group">
            <input
              type="email"
              className="form-input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Correo electrónico</label>
            <i className="bi bi-envelope-fill input-icon"></i>
          </div>

          <div className="form-floating-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-input"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Contraseña</label>
            <i
              className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} input-icon password-toggle`}
              onClick={() => setShowPassword(!showPassword)}
              title="Mostrar/Ocultar contraseña"
            ></i>
            <i className="bi bi-lock-fill input-icon lock-icon"></i>
          </div>

          <button type="submit" className="btn-primary w-100">Entrar</button>

          <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="google-icon"
            />
            Continuar con Google
          </button>

          <div className="register-link">
            ¿No tienes cuenta?
            <a onClick={() => navigate('/register')}>Regístrate aquí</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
