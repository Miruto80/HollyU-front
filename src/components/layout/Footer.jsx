import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer bg-light py-5" role="contentinfo">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 mb-3">
            <h5>HollyU Uniformes</h5>
            <p className="text-muted">Confección y venta de uniformes profesionales y prendas a medida.</p>
          </div>

          <div className="col-6 col-md-2 mb-3">
            <h6>Compañía</h6>
            <ul className="list-unstyled">
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/catalog">Catálogo</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <h6>Atención</h6>
            <ul className="list-unstyled">
              <li>Tel: <a href="tel:+511234567">(01) 123 4567</a></li>
              <li>Email: <a href="mailto:ventas@hollyu.pe">ventas@hollyu.pe</a></li>
              <li><Link to="/faq">Preguntas frecuentes</Link></li>
            </ul>
          </div>

          <div className="col-12 col-md-3 mb-3">
            <h6>Síguenos</h6>
            <div className="d-flex gap-2">
              <a href="#" aria-label="Instagram" className="text-decoration-none">Instagram</a>
              <a href="#" aria-label="Facebook" className="text-decoration-none">Facebook</a>
            </div>
          </div>
        </div>

        <div className="text-center pt-3 mt-3 border-top">
          <small className="text-muted">© {new Date().getFullYear()} HollyU Uniformes. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>
  );
}

