import "../../assets/css/FAQ.css";

const faqs = [
  {
    q: "¿Cómo encargo un uniforme a medida?",
    a: "Puedes ir a la sección de Catálogo, elegir un modelo y seleccionar la opción 'A medida' o contactar a ventas para coordinar tallas y acabados."
  },
  {
    q: "¿Cuál es el tiempo de entrega?",
    a: "El tiempo estándar de producción es de 7 a 14 días hábiles dependiendo de la personalización y la temporada."
  },
  {
    q: "¿Ofrecen descuentos por volumen?",
    a: "Sí. Contamos con descuentos especiales para empresas, clínicas, colegios y pedidos corporativos."
  },
  {
    q: "¿Puedo devolver o cambiar mi pedido?",
    a: "Las prendas personalizadas no tienen cambio. Para productos estándar aplican nuestras políticas de cambios."
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos efectivo, transferencia bancaria, pago móvil y otros métodos habilitados por la tienda."
  },
  {
    q: "¿Realizan envíos nacionales?",
    a: "Sí. Realizamos envíos a todo el país mediante empresas de encomiendas."
  }
];

export default function FAQ() {
  return (
    <section className="faq-section py-5">
      <div className="container">

        <div className="text-center mb-5">
          <h2 className="faq-title">
            Preguntas <span>Frecuentes</span>
          </h2>

          <p className="faq-subtitle">
            Encuentra respuestas a las dudas más comunes sobre nuestros
            uniformes, pedidos y personalizaciones.
          </p>
        </div>

        <div className="accordion" id="faqAccordion">
          {faqs.map((item, index) => (
            <div className="accordion-item faq-card" key={index}>

              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${
                    index !== 0 ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq${index}`}
                >
                  {item.q}
                </button>
              </h2>

              <div
                id={`faq${index}`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">
                  {item.a}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}