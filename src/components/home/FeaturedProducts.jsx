import React from "react";
import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

import img1 from "../../assets/img/IMG_4023.webp";
import img2 from "../../assets/img/IMG_0133.webp";
import img3 from "../../assets/img/IMG_6496.webp";

import "../../assets/css/FeaturedProducts.css";

const products = [
  {
    id: 1,
    name: "Jersey Enfermería",
    category: "Enfermería",
    price: 89,
    img: img1,
  },
  {
    id: 2,
    name: "Casaca Odontología",
    category: "Odontología",
    price: 99,
    img: img2,
  },
  {
    id: 3,
    name: "Blusa Dama",
    category: "Dama",
    price: 79,
    img: img3,
  },
  {
    id: 4,
    name: "Pijama Quirúrgica",
    category: "Enfermería",
    price: 95,
    img: img1,
  },
  {
    id: 5,
    name: "Chaqueta Profesional",
    category: "Administrativo",
    price: 110,
    img: img2,
  },
  {
    id: 6,
    name: "Uniforme Spa",
    category: "Peluquería y Spa",
    price: 85,
    img: img3,
  },
];

export default function FeaturedProducts() {
  const options = {
    type: "loop",
    perPage: 3,
    perMove: 1,
    gap: "1.5rem",
    arrows: true,
    pagination: false,
    drag: true,
    autoplay: false,
    breakpoints: {
      991: {
        perPage: 2,
      },
      575: {
        perPage: 1,
      },
    },
  };

  return (
    <section className="featured-products">

      <div className="container">

        {/* Encabezado */}
        <div className="featured-header">

          <div>
            <span className="featured-subtitle">
              NUESTRA COLECCIÓN
            </span>

            <h2 className="featured-title">
              Productos destacados
            </h2>

            <p className="featured-description">
              Descubre algunos de nuestros uniformes más destacados,
              diseñados para ofrecer comodidad, elegancia y una imagen
              profesional.
            </p>
          </div>

        </div>


        {/* SLIDER */}

        <Splide
          options={options}
          aria-label="Productos destacados"
          className="featured-splide"
        >

          {products.map((product) => (

            <SplideSlide key={product.id}>

              <Link
                to={`/product/${product.id}`}
                className="featured-card"
              >

                {/* Imagen */}

                <div className="featured-image">

                  <img
                    src={product.img}
                    alt={product.name}
                    loading="lazy"
                  />

                  <span className="featured-badge">
                    Destacado
                  </span>

                </div>


                {/* Información */}

                <div className="featured-card-body">

                  <span className="featured-category">
                    {product.category}
                  </span>

                  <h5 className="featured-product-name">
                    {product.name}
                  </h5>

                  <div className="featured-product-footer">

                    <span className="featured-price">
                      ${product.price.toLocaleString()}
                    </span>

                    <span className="featured-arrow">
                      →
                    </span>

                  </div>

                </div>

              </Link>

            </SplideSlide>

          ))}

        </Splide>


        {/* BOTÓN */}

        <div className="featured-button-container">

          <Link
            to="/catalog/all"
            className="featured-button"
          >
            Ver todos los productos
          </Link>

        </div>

      </div>

    </section>
  );
}