import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

export default function LoginForm() {

  return (

    <div className="login-form">

      <img
        src="/images/logo-hollyu.png"
        alt="HolyHoly"
        className="login-logo"
      />

      <h2>Bienvenido</h2>

      <p>
        Inicia sesión para continuar.
      </p>

      {/* Correo */}

      <div className="mb-3">

        <label>

          Correo electrónico

        </label>

        <div className="input-group">

          <span className="input-group-text">

            <FontAwesomeIcon icon={faEnvelope} />

          </span>

          <input
            type="email"
            className="form-control"
          />

        </div>

      </div>

      {/* Password */}

      <div className="mb-3">

        <label>

          Contraseña

        </label>

        <div className="input-group">

          <span className="input-group-text">

            <FontAwesomeIcon icon={faLock} />

          </span>

          <input
            type="password"
            className="form-control"
          />

          <button
            className="btn btn-outline-secondary"
            type="button"
          >

            <FontAwesomeIcon icon={faEye} />

          </button>

        </div>

      </div>

      <div
        className="d-flex justify-content-between mb-4"
      >

        <div>

          <input
            type="checkbox"
            className="form-check-input"
          />

          <label className="ms-2">

            Recordarme

          </label>

        </div>

        <Link to="/recuperar">

          ¿Olvidaste tu contraseña?

        </Link>

      </div>

      <button className="btn login-btn w-100">

       <Link to="/admin">
         Iniciar sesión
        </Link>

      </button>

      <div className="text-center mt-4">

        ¿No tienes cuenta?

        <Link to="/registro">

          Registrarse

        </Link>

      </div>

    </div>

  );

};