import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/css/Hero.css";
import heroImageOne from "../../assets/img/IMG_4023.webp";
import heroImageTwo from "../../assets/img/IMG_0133.webp";
import heroImageThree from "../../assets/img/IMG_6496.webp";
import heroImageFour from "../../assets/img/IMG_4216.webp";

const heroProducts = [
  {
    id: 1,
    image: heroImageOne,
    category: "Enfermería",
    link: "/catalog/enfermeria",
  },
  {
    id: 2,
    image: heroImageTwo,
    category: "Odontología",
    link: "/catalog/odontologia",
  },
  {
    id: 3,
    image: heroImageThree,
    category: "Dama",
    link: "/catalog/dama",
  },
  {
    id: 4,
    image: heroImageFour,
    category: "Caballero",
    link: "/catalog/caballero",
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

      {/* Parte inferior */}
      <div className="hero-bottom">

        <div className="hero-brand">

          <span className="hero-brand-title">
            HOLYHOLY
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
            to="/catalog"
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