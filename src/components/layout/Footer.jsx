import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import {
  faFacebookF,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import "../../assets/css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-hollyu">
      <div className="container py-5">
        <div className="row gy-4">
          {/* Logo */}
          <div className="col-lg-4">
            <h3 className="footer-logo">
              Holy<span>Holy</span>
            </h3>

            <p className="footer-text">
              Uniformes profesionales de alta calidad para empresas,
              clínicas, restaurantes, hoteles y cualquier negocio que
              quiera destacar con una imagen elegante.
            </p>

            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>

              <a href="#" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>

              <a href="#" aria-label="WhatsApp">
                <FontAwesomeIcon icon={faWhatsapp} />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div className="col-md-4 col-lg-2">
            <h5>Navegación</h5>

            <ul className="footer-links">
              <li>
                <Link to="/">Inicio</Link>
              </li>

              <li>
                <Link to="/catalog/all">Catálogo</Link>
              </li>

              <li>
                <Link to="/nosotros">Nosotros</Link>
              </li>

              <li>
                <Link to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div className="col-md-4 col-lg-3">
            <h5>Información</h5>

            <ul className="footer-links">
              <li>
                <Link to="/faq">Preguntas frecuentes</Link>
              </li>

              <li>
                <Link to="/politicas">Políticas</Link>
              </li>

              <li>
                <Link to="/terminos">Términos</Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-md-4 col-lg-3">
            <h5>Contacto</h5>

            <div className="footer-contact">
              <p>
                <FontAwesomeIcon icon={faPhone} />
                <span>+58 412-000-0000</span>
              </p>

              <p>
                <FontAwesomeIcon icon={faEnvelope} />
                <span>ventas@hollyu.com</span>
              </p>

              <p>
                <FontAwesomeIcon icon={faLocationDot} />
                <span>Barquisimeto, Venezuela</span>
              </p>
            </div>
          </div>
        </div>

        <hr />

        <div className="footer-copy">
          © {new Date().getFullYear()} HollyU. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}