import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '../../firebase';
import '../../styles/register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Cuenta creada exitosamente');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está en uso');
      } else if (err.code === 'auth/invalid-email') {
        setError('El correo no es válido');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil');
      } else {
        setError('Ocurrió un error al registrarse');
      }
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account', // fuerza selección de cuenta + confirmación
    });

    try {
      await signInWithPopup(auth, provider);
      setSuccess('Cuenta de Google vinculada exitosamente');
      setTimeout(() => navigate('/home'), 3000);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('La ventana de Google fue cerrada sin completar el registro.');
      } else {
        setError('Error al registrarse con Google');
      }
    }
  };

  return (
    <div className="register-container">
      <div className={`register-card ${error ? 'register-error' : ''}`}>
        <div className="register-header">
          <h2>Crear Cuenta</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="register-floating-group">
            <input
              type="email"
              className="register-input"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="register-email">Correo electrónico</label>
            <i className="bi bi-envelope-fill register-icon"></i>
          </div>

          <div className="register-floating-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="register-input"
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="register-password">Contraseña</label>
            <i className="bi bi-lock-fill register-icon lock-icon"></i>
            <i
              className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} register-icon password-toggle`}
              onClick={() => setShowPassword(!showPassword)}
              title="Mostrar/Ocultar contraseña"
            ></i>
          </div>

          <div className="register-floating-group">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="register-input"
              id="register-confirm"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="register-confirm">Confirmar contraseña</label>
            <i className="bi bi-shield-lock-fill register-icon lock-icon"></i>
            <i
              className={`bi ${showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} register-icon password-toggle`}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title="Mostrar/Ocultar confirmación"
            ></i>
          </div>

          <button type="submit" className="register-btn w-100">Registrarse</button>

          <button
            type="button"
            className="google-btn w-100"
            onClick={handleGoogleRegister}
          >
            <img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="Google" className="google-icon" />
            Registrarse con Google
          </button>

          <div className="register-link">
            ¿Ya tienes una cuenta?
            <a className="register-link-text" onClick={() => navigate('/login')}>Inicia sesión</a>
          </div>
        </form>
      </div>

      {error && (
        <div className="register-toast-error">
          <i className="bi bi-exclamation-circle-fill toast-icon"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="register-toast-success">
          <i className="bi bi-check-circle-fill toast-icon"></i>
          {success}
        </div>
      )}
    </div>
  );
};

export default Register;
