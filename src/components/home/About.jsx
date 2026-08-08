import "../../assets/css/About.css";
import aboutImg from "../../assets/img/IMG_9567.webp";

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="about-hero">
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

      {/* Historia */}

      <section className="about-section">
        <div className="container">

          <div className="text-center mb-5">
            <h2>Nuestra Historia</h2>

            <p>
              Nacimos con el objetivo de ofrecer uniformes elegantes,
              resistentes y completamente personalizados para empresas
              que desean destacar su imagen corporativa.
            </p>
          </div>

          <div className="row g-4">

            <div className="col-md-4">

              <div className="about-card">

                <h3>Misión</h3>

                <p>
                  Proporcionar uniformes de excelente calidad,
                  funcionales y modernos que fortalezcan la identidad
                  de nuestros clientes.
                </p>

              </div>

            </div>

            <div className="col-md-4">

              <div className="about-card">

                <h3>Visión</h3>

                <p>
                  Convertirnos en una de las empresas líderes en la
                  confección de uniformes personalizados en
                  Latinoamérica.
                </p>

              </div>

            </div>

            <div className="col-md-4">

              <div className="about-card">

                <h3>Valores</h3>

                <ul>
                  <li>✔ Calidad</li>
                  <li>✔ Innovación</li>
                  <li>✔ Compromiso</li>
                  <li>✔ Puntualidad</li>
                  <li>✔ Atención personalizada</li>
                </ul>

              </div>

            </div>

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