import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faCheck, faEye, faGem } from "@fortawesome/free-solid-svg-icons";
import PromoStrip from "../home/PromoStrip.jsx";
import "../../assets/css/About.css";
import aboutImg from "../../assets/img/IMG_9567.webp";

export default function About() {
  return (
    <>
      {/* Hero */}
      <section id="nosotros" className="about-hero">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <span className="about-subtitle">
                Conoce HolyHoly
              </span>

              <h1 className="about-title">
                Uniformes que representan la identidad de tu empresa
              </h1>

              <p className="about-text">
                En HolyHoly diseñamos y confeccionamos uniformes
                profesionales con materiales de alta calidad para
                clínicas, restaurantes, hoteles, empresas y todo tipo
                de organizaciones que buscan proyectar una imagen
                moderna y profesional.
              </p>

              <p className="about-text">
                Nuestro equipo combina creatividad, precisión y atención
                a cada detalle para ofrecer soluciones personalizadas
                que se adaptan a la cultura y al estilo de tu marca.
                Además, trabajamos de la mano contigo desde el diseño
                hasta la entrega, garantizando comodidad, durabilidad
                y un acabado impecable en cada prenda.
              </p>
            </div>

            <div className="col-lg-6 text-center">
              <img
                src={aboutImg}
                alt="HollyU"
                className="img-fluid rounded-4 shadow"
              />
            </div>

          </div>
        </div>
      </section>

      <section className="stats-section2">

        <div className="container">
          <PromoStrip />
        </div>

      </section>

      {/* Historia */}

      <section className="about-section">
        <div className="container">

          <div className="about-section-heading">
            <div>
              <span className="about-section-eyebrow">Nuestra esencia</span>
              <h2>Nuestra Historia</h2>
            </div>
            <p className="about-section-description">
              Nacimos con el objetivo de crear uniformes elegantes,
              resistentes y completamente personalizados, ayudando a
              cada empresa a vestir su identidad con orgullo.
            </p>
          </div>

          <div className="about-story-grid">

            <article className="about-card">
              <div className="about-card-top">
                <span className="about-card-icon">
                  <FontAwesomeIcon icon={faBullseye} />
                </span>
                <span className="about-card-number">01</span>
              </div>
              <h3>Misión</h3>
              <p>
                Proporcionar uniformes de excelente calidad,
                funcionales y modernos que fortalezcan la identidad
                de nuestros clientes.
              </p>
            </article>

            <article className="about-card about-card-featured">
              <div className="about-card-top">
                <span className="about-card-icon">
                  <FontAwesomeIcon icon={faEye} />
                </span>
                <span className="about-card-number">02</span>
              </div>
              <h3>Visión</h3>
              <p>
                Convertirnos en una de las empresas líderes en la
                confección de uniformes personalizados en
                Latinoamérica.
              </p>
            </article>

            <article className="about-card about-values-card">
              <div className="about-card-top">
                <span className="about-card-icon">
                  <FontAwesomeIcon icon={faGem} />
                </span>
                <span className="about-card-number">03</span>
              </div>
              <h3>Valores</h3>
              <ul className="about-values">
                {["Calidad", "Innovación", "Compromiso", "Puntualidad", "Atención personalizada"].map((value) => (
                  <li key={value}>
                    <span className="about-value-check">
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    {value}
                  </li>
                ))}
              </ul>
            </article>

            </div>

        </div>
      </section>

      {/* Estadísticas */}

      <section className="stats-section">

        <div className="container">

          <div className="row text-center">

            <div className="col-md-3">
              <h2>500+</h2>
              <span>Clientes</span>
            </div>

            <div className="col-md-3">
              <h2>10K+</h2>
              <span>Uniformes</span>
            </div>

            <div className="col-md-3">
              <h2>100%</h2>
              <span>Personalizados</span>
            </div>

            <div className="col-md-3">
              <h2>24/7</h2>
              <span>Atención</span>
            </div>

          </div>

        </div>

      </section>

    </>
  );
}