import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye } from "@fortawesome/free-solid-svg-icons";
import { usePostFetch } from "../../hooks/usePostFetch";

export default function LoginForm() {
  const navigate = useNavigate();
  const { post, loading, error } = usePostFetch("/auth/login");

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await post(form);

      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(result.usuario));

      navigate("/admin");
    } catch {
      // el error ya queda en el estado del hook
    }
  };

  return (
    <div className="login-form">
      <img src="/images/logo-hollyu.png" alt="HolyHoly" className="login-logo" />
      <h2>Bienvenido</h2>
      <p>Inicia sesión para continuar.</p>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert alert-danger">
            {error.response?.data?.message || "Error al iniciar sesión"}
          </div>
        )}

        <div className="mb-3">
          <label>Correo electrónico</label>
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <div className="input-group">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faLock} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between mb-4">
          <div>
            <input type="checkbox" className="form-check-input" />
            <label className="ms-2">Recordarme</label>
          </div>
          <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
        </div>

        <button className="btn login-btn w-100" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <div className="text-center mt-4">
        ¿No tienes cuenta? <Link to="/registro">Registrarse</Link>
      </div>
    </div>
  );
}