import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faPhone,
  faEnvelope,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

import {
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

import { openTermsModal } from "../catalog/Terms.jsx";
import "../../assets/css/Footer.css";

const phoneNumber = "+58 04145119764";
const whatsappNumber = "584145119764";

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
              <a href="https://www.instagram.com/holyholyuniformes/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
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
                <Link to="/catalog">Catálogo</Link>
              </li>

              <li>
                <Link to="/#nosotros">Nosotros</Link>
              </li>
              
            </ul>
          </div>

          {/* Información */}
          <div className="col-md-4 col-lg-3">
            <h5>Información</h5>

            <ul className="footer-links">
              <li>
                <Link to="/#faq">Preguntas frecuentes</Link>
              </li>

              <li>
                <button
                  type="button"
                  onClick={openTermsModal}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: "inherit",
                    font: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Términos
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-md-4 col-lg-3">
            <h5>Contacto</h5>

            <div className="footer-contact">
              <p>
                <FontAwesomeIcon icon={faPhone} />
                <a className="text-reset text-decoration-none" href={`tel:${whatsappNumber}`}>
                  {phoneNumber}
                </a>
              </p>

              <p>
                <FontAwesomeIcon icon={faEnvelope} />
                <a className="text-reset text-decoration-none" href="mailto:alexyvb33@gmail.com">
                  alexyvb33@gmail.com
                </a>
              </p>

              <p>
                <FontAwesomeIcon icon={faLocationDot} />
                <a
                  className="text-reset text-decoration-none"
                  href="https://www.google.com/maps/search/?api=1&query=Barquisimeto%2C%20Venezuela"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Barquisimeto, Venezuela
                </a>
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