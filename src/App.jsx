import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import NuevoMovimientoPage from './pages/NuevoMovimientoPage';
import AñadirGastoPlazoPage from './pages/GastoPlazoPage';
import ClientesPage from './pages/ClientesPage'; // NUEVO
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Privadas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/nuevo"
          element={
            <PrivateRoute>
              <NuevoMovimientoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/nuevo-gasto-plazo"
          element={
            <PrivateRoute>
              <AñadirGastoPlazoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <ClientesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
