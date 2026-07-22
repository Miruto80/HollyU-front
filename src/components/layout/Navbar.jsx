import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/css/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg hollyu-navbar">
      <div className="container">

        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <img
            src="/src/assets/img/Logo.jpeg"
            alt="HollyU Uniformes"
            className="hollyu-logo-image"
          />
        </Link>

        {/* Botón móvil */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hollyuNavbar"
          aria-controls="hollyuNavbar"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div
          className="collapse navbar-collapse"
          id="hollyuNavbar"
        >

          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <Link to="/" className="nav-link">
                Inicio
              </Link>
            </li>

            <li className="nav-item dropdown">

              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Uniformes
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="ms-2 dropdown-icon"
                />
              </a>

              <ul className="dropdown-menu hollyu-dropdown">

                <li>
                  <Link to="/catalogo" className="dropdown-item">
                    Ver todos
                  </Link>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    to="/catalogo/estudiantes"
                    className="dropdown-item"
                  >
                    Estudiantes
                  </Link>
                </li>

                <li>
                  <Link
                    to="/catalogo/enfermeria"
                    className="dropdown-item"
                  >
                    Enfermería
                  </Link>
                </li>

                <li>
                  <Link
                    to="/catalogo/odontologia"
                    className="dropdown-item"
                  >
                    Odontología
                  </Link>
                </li>

                <li>
                  <Link
                    to="/catalogo/dama"
                    className="dropdown-item"
                  >
                    Dama
                  </Link>
                </li>

                <li>
                  <Link
                    to="/catalogo/caballero"
                    className="dropdown-item"
                  >
                    Caballero
                  </Link>
                </li>

                <li>
                  <Link
                    to="/catalogo/spa"
                    className="dropdown-item"
                  >
                    Peluquería y Spa
                  </Link>
                </li>

              </ul>

            </li>

            <li className="nav-item">
              <Link to="/nosotros" className="nav-link">
                Nosotros
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/contacto" className="nav-link">
                Contacto
              </Link>
            </li>

          </ul>

          {/* Acciones */}
          <div className="hollyu-actions">

            {/* Carrito */}
            <Link
              to="/carrito"
              className="cart-button"
              aria-label="Carrito"
            >
              <FontAwesomeIcon icon={faCartShopping} />

              <span className="cart-count">
                0
              </span>
            </Link>

            {/* Login */}
            <Link
              to="/login"
              className="login-button"
              aria-label="Iniciar sesión"
            >
              <FontAwesomeIcon icon={faUser} />
            </Link>

          </div>

        </div>

      </div>
    </nav>
  );
};