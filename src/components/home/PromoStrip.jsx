import React from 'react';
import { Link } from 'react-router-dom';

export default function PromoStrip() {
  return (
    <div className="promo-strip text-center py-2" role="region" aria-label="Promociones">
      <div className="container">
        <span>Envío gratis en pedidos sobre S/150 — </span>
        <Link to="/catalog" className="fw-semibold ms-1">Ver ofertas</Link>
      </div>
    </div>
  );
}
