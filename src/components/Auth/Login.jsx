import React from 'react'

function Login() {
  return (
    <div className="login-form-container container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Iniciar sesión</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input type="email" className="form-control" id="email" placeholder="tucorreo@ejemplo.com" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input type="password" className="form-control" id="password" placeholder="••••••••" />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login