import React, { useState, useEffect } from 'react';
import { auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [shakeInputs, setShakeInputs] = useState(false); // nueva flag

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setShakeInputs(true);
      const timer = setTimeout(() => {
        setError(null);
        setShakeInputs(false); // quitar shake después
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account', // fuerza selección de cuenta
    });
    try {
      await signInWithPopup(auth, provider);
      localStorage.setItem('isAuthenticated', 'true');
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
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/home');
    } catch (error) {
      setError("Error de autenticación. Verifica tu correo y contraseña.");
    }
  };

  return (
    <div className="login-container">
      <div className={`login-card ${error ? 'login-error' : ''}`}>
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={`form-floating-group ${shakeInputs ? 'input-error' : ''}`}>
            <input
              type="email"
              autoComplete='email'
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

          <div className={`form-floating-group ${shakeInputs ? 'input-error' : ''}`}>
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

            {/* Icono candado */}
            <i className="bi bi-lock-fill input-icon lock-icon"></i>

            {/* Icono ojo */}
            <i
              className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} input-icon password-toggle`}
              onClick={() => setShowPassword(!showPassword)}
              title="Mostrar/Ocultar contraseña"
            ></i>
          </div>


          <button type="submit" className="btn-primary w-100">Entrar</button>

          <div className="register-link">
            ¿No tienes cuenta?
            <a className="register-link-text" onClick={() => navigate('/register')}>Regístrate aquí</a>
          </div>

          <div className="separator">
            <hr /><span className="separator-o">O</span><hr />
          </div>

          <button type="button" className="google-btn" onClick={handleGoogleSignIn}>
            <img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="Google" className="google-icon" />
            Continuar con Google
          </button>
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

export default Login;
