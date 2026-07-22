import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import "../assets/css/Hero.css";
import heroImageOne from "../assets/img/IMG_4023.webp";
import heroImageTwo from "../assets/img/hero.png";

const heroProducts = [
  {
    id: 1,
    image: heroImageOne,
    category: "Enfermería",
    link: "/catalogo/enfermeria",
  },
  {
    id: 2,
    image: heroImageTwo,
    category: "Odontología",
    link: "/catalogo/odontologia",
  },
  {
    id: 3,
    image: heroImageTwo,
    category: "Dama",
    link: "/catalogo/dama",
  },
  {
    id: 4,
    image: heroImageTwo,
    category: "Caballero",
    link: "/catalogo/caballero",
  },
];

export default function Hero() {
  return (
    <section className="hollyu-hero">

      {/* Galería principal */}
      <div className="hero-gallery">

        {heroProducts.map((product) => (

          <Link
            key={product.id}
            to={product.link}
            className="hero-gallery-item"
          >

            <img
              src={product.image}
              alt={product.category}
            />

            <div className="hero-gallery-overlay">

              <span>
                {product.category}
              </span>

              <FontAwesomeIcon
                icon={faArrowRight}
              />

            </div>

          </Link>

        ))}

      </div>

      {/* Controles */}
      <button
        className="hero-control hero-control-left"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <button
        className="hero-control hero-control-right"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>

      {/* Parte inferior */}
      <div className="hero-bottom">

        <div className="hero-brand">

          <span className="hero-brand-title">
            HOLLYU
          </span>

          <span className="hero-brand-subtitle">
            UNIFORMES
          </span>

        </div>

        <div className="hero-description">

          <h1>
            Uniformes que representan
            <br />
            tu estilo.
          </h1>

          <p>
            Diseñamos y ofrecemos uniformes pensados
            para acompañarte en cada etapa de tu profesión.
          </p>

          <Link
            to="/catalogo"
            className="hero-button"
          >
            Explorar colección

            <FontAwesomeIcon
              icon={faArrowRight}
              className="ms-2"
            />

          </Link>

        </div>

      </div>

      {/* Indicadores */}
      <div className="hero-indicators">

        <span className="active"></span>
        <span></span>
        <span></span>
        <span></span>

      </div>

    </section>
  );
};