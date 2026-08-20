import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faIdCard, faLock, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { usePostFetch } from "../../hooks/usePostFetch";
import "../../assets/css/Register.css";

export default function RegisterModal({ show, onClose }) {
  const navigate = useNavigate();
  const { post, loading, error } = usePostFetch("/auth/register");
  const [form, setForm] = useState({ nombres: "", apellidos: "", documento: "", email: "", telefono: "", password: "", confirmPassword: "" });

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) return;

    try {
      const result = await post(form);
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(result.usuario));
      onClose();
      navigate("/");
    } catch {
      return;
    }
  };

  if (!show) return null;

  return (
    <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="register-title">
      <div className="register-dialog">
        <div className="register-header">
          <div>
            <span className="register-eyebrow">HollyU</span>
            <h2 id="register-title">Crea tu cuenta</h2>
          </div>
          <button type="button" className="register-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <p className="register-intro">Regístrate para guardar tus datos y consultar tus pedidos.</p>
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="alert alert-danger py-2">{error.response?.data?.message || "No se pudo crear la cuenta"}</div>}
          {form.password !== form.confirmPassword && form.confirmPassword && <div className="alert alert-warning py-2">Las contraseñas no coinciden</div>}

          <div className="row g-3">
            <div className="col-md-6"><label className="form-label" htmlFor="register-nombres">Nombres</label><div className="register-input"><FontAwesomeIcon icon={faUser} /><input id="register-nombres" name="nombres" value={form.nombres} onChange={handleChange} required /></div></div>
            <div className="col-md-6"><label className="form-label" htmlFor="register-apellidos">Apellidos</label><input id="register-apellidos" className="form-control" name="apellidos" value={form.apellidos} onChange={handleChange} required /></div>
            <div className="col-md-6"><label className="form-label" htmlFor="register-documento">Cédula</label><div className="register-input"><FontAwesomeIcon icon={faIdCard} /><input id="register-documento" type="text" name="documento" inputMode="numeric" value={form.documento} onChange={handleChange} required /></div></div>
            <div className="col-md-6"><label className="form-label" htmlFor="register-email">Correo electrónico</label><div className="register-input"><FontAwesomeIcon icon={faEnvelope} /><input id="register-email" type="email" name="email" value={form.email} onChange={handleChange} required /></div></div>
            <div className="col-md-6"><label className="form-label" htmlFor="register-telefono">Teléfono</label><div className="register-input"><FontAwesomeIcon icon={faPhone} /><input id="register-telefono" name="telefono" value={form.telefono} onChange={handleChange} /></div></div>
            <div className="col-md-6"><label className="form-label" htmlFor="register-password">Contraseña</label><div className="register-input"><FontAwesomeIcon icon={faLock} /><input id="register-password" type="password" name="password" minLength="6" value={form.password} onChange={handleChange} required /></div></div>
            <div className="col-md-6"><label className="form-label" htmlFor="register-confirm">Confirmar contraseña</label><input id="register-confirm" className="form-control" type="password" name="confirmPassword" minLength="6" value={form.confirmPassword} onChange={handleChange} required /></div>
          </div>
          <button className="btn login-btn w-100 mt-4" type="submit" disabled={loading || form.password !== form.confirmPassword}>{loading ? "Creando cuenta..." : "Crear cuenta"}</button>
        </form>
      </div>
    </div>
  );
}