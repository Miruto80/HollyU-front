import { Navigate } from "react-router-dom";

export default function ProtectRoute({ children, rolPermitido }) {
  const usuarioRaw = localStorage.getItem("usuario");
  const token = localStorage.getItem("accessToken");

  if (!token || !usuarioRaw) {
    return <Navigate to="/login" replace />;
  }

  const usuario = JSON.parse(usuarioRaw);

  if (rolPermitido && usuario.rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
}