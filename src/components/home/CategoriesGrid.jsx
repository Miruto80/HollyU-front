import React from 'react';
import { Link } from 'react-router-dom';
import { useGetFetch } from '../../hooks/useGetFetch';
import '../../assets/css/CategoriesGrid.css';
import img1 from '../../assets/img/IMG_4023.webp';
import img2 from '../../assets/img/IMG_0133.webp';
import img3 from '../../assets/img/IMG_6496.webp';
import img4 from '../../assets/img/IMG_4216.webp';

const imageMap = {
  enfermeria: img1,
  odontologia: img2,
  dama: img3,
  caballero: img4,
};

const fallbackCategories = [
  { id: 'enf', title: 'Enfermería', img: img1, link: '/catalog/enfermeria' },
  { id: 'odo', title: 'Odontología', img: img2, link: '/catalog/odontologia' },
  { id: 'dama', title: 'Dama', img: img3, link: '/catalog/dama' },
  { id: 'cab', title: 'Caballero', img: img4, link: '/catalog/caballero' },
];

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function CategoriesGrid() {
  const { data: categorias, loading, error } = useGetFetch('/categorias');

  const categories = categorias?.length
    ? categorias.map((categoria) => {
        const slug = slugify(categoria.nombre);
        return {
          id: categoria.id,
          title: categoria.nombre,
          img: imageMap[slug] || img1,
          link: `/catalog/${slug}`,
        };
      })
    : fallbackCategories;

  if (loading) {
    return <div className="text-center py-5">Cargando categorías...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        No se pudo cargar las categorías. Mostrando opciones por defecto.
      </div>
    );
  }

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
