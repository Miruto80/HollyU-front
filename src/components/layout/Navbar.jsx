import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLogout } from "../../hooks/useLogout";
import {
  faCartShopping,
  faUser,
  faChevronDown,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import { useGetFetch } from "../../hooks/useGetFetch";
import { useCart } from "../../hooks/useCart";
import CartDropdown from "./CartDropdown";
import "../../assets/css/Navbar.css";

export default function Navbar() {
  const { data: categorias = [], loading } = useGetFetch("/categorias");
  const isLogged = Boolean(localStorage.getItem("accessToken"));
  const handleLogout = useLogout();

  const { totalItems } = useCart();
  const [showCart, setShowCart] = useState(false);

  return (
    <>
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
                    <Link to="/catalog" className="dropdown-item">
                      Ver todos
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  {!loading && categorias.length > 0 ? (
                    categorias.map((categoria) => {
                      const slug = categoria.nombre
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/(^-|-$)/g, "");

                      return (
                        <li key={categoria.id}>
                          <Link
                            to={`/catalog/${slug}?categoria_id=${categoria.id}`}
                            className="dropdown-item"
                          >
                            {categoria.nombre}
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <li className="dropdown-item text-muted">Cargando categorías...</li>
                  )}

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
              <button
                type="button"
                className="cart-button btn btn-link"
                aria-label="Carrito"
                onClick={() => setShowCart(true)}
              >
                <FontAwesomeIcon icon={faCartShopping} />

                <span className="cart-count">
                  {totalItems}
                </span>
              </button>

              {/* Login / Logout */}
              {isLogged ? (
                <button
                  type="button"
                  className="login-button btn btn-link"
                  aria-label="Cerrar sesión"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="login-button"
                  aria-label="Iniciar sesión"
                >
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              )}

            </div>

          </div>

        </div>
      </nav>

      <CartDropdown show={showCart} onClose={() => setShowCart(false)} />
      {showCart && (
        <div className="offcanvas-backdrop fade show" onClick={() => setShowCart(false)}></div>
      )}
    </>
  );
}