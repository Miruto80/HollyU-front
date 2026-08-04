import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../assets/img/IMG_4023.webp';
import img2 from '../../assets/img/IMG_0133.webp';
import img3 from '../../assets/img/IMG_6496.webp';

const products = [
  { id: 1, name: 'Jersey Enfermería', price: 'S/89.00', img: img1, link: '/product/1' },
  { id: 2, name: 'Casaca Odontología', price: 'S/99.00', img: img2, link: '/product/2' },
  { id: 3, name: 'Blusa Dama', price: 'S/79.00', img: img3, link: '/product/3' },
];

export default function FeaturedProducts() {
  return (
    <div className="featured-products">
      <h2 className="mb-3">Productos destacados</h2>

      <div className="row g-3">
        {products.map((p) => (
          <div key={p.id} className="col-12 col-md-4">
            <div className="card h-100">
              <Link to={p.link} className="text-decoration-none text-dark">
                <img src={p.img} alt={p.name} loading="lazy" className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text text-muted">{p.price}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
