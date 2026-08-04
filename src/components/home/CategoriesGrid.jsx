import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../../assets/img/IMG_4023.webp';
import img2 from '../../assets/img/IMG_0133.webp';
import img3 from '../../assets/img/IMG_6496.webp';
import img4 from '../../assets/img/IMG_4216.webp';

const categories = [
  { id: 'enf', title: 'Enfermería', img: img1, link: '/catalog/enfermeria' },
  { id: 'odo', title: 'Odontología', img: img2, link: '/catalog/odontologia' },
  { id: 'dama', title: 'Dama', img: img3, link: '/catalog/dama' },
  { id: 'cab', title: 'Caballero', img: img4, link: '/catalog/caballero' },
];

export default function CategoriesGrid() {
  return (
    <div className="categories-grid row g-3">
      {categories.map((c) => (
        <div key={c.id} className="col-6 col-md-3">
          <Link to={c.link} className="category-card d-block text-decoration-none text-dark">
            <div className="ratio ratio-4x3 overflow-hidden rounded">
              <img src={c.img} alt={c.title} loading="lazy" className="w-100 h-100 object-fit-cover" />
            </div>
            <div className="mt-2 text-center">
              <strong>{c.title}</strong>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
