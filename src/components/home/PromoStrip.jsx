import React from 'react';
import { Link } from 'react-router-dom';
import "../../assets/css/PromoStrip.css";

export default function PromoStrip() {
  return (
    <div className="promo-strip" role="region" aria-label="Promociones">
      <div className="container">
        <span>Envío gratis en pedidos sobre S/150 —</span>
        <Link to="/catalog" className="promo-strip-link">Ver ofertas</Link>
      </div>
    </div>
  );
}
