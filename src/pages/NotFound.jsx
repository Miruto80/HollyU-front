import { Link, useNavigate } from "react-router-dom";
import '../assets/css/NotFound.css';

function getHomePath() {
  const usuarioRaw = localStorage.getItem("usuario");
  if (!usuarioRaw) return "/";

  try {
    const usuario = JSON.parse(usuarioRaw);
    return usuario?.rol === "Administrador" ? "/admin" : "/";
  } catch (error) {
    if (error instanceof SyntaxError) return "/";
    throw error;
  }
}

export default function NotFound() {
  const homePath = getHomePath();

  return (
    <main className="not-found-wrapper">
      <div className="not-found-card">
        {/* Número 404 con efecto visual */}
        <div className="not-found-code-container">
          <span className="not-found-code" aria-hidden="true">404</span>
          <h1 className="not-found-code-main">404</h1>
        </div>

        <h2 className="not-found-title">¡Ups! Página no encontrada</h2>

        <p className="not-found-description">
          Parece que el enlace está roto o la página fue movida
        </p>

        <div className="not-found-actions">
          <Link to={homePath} className="btn-not-found-primary">
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}