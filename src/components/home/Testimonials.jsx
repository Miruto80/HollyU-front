import '../../assets/css/Testimonials.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faStar } from '@fortawesome/free-solid-svg-icons';

const quotes = [
  {
    id: 1,
    author: 'María López',
    role: 'Gerente de clínica',
    text: 'La calidad superó nuestras expectativas. Los uniformes se sienten cómodos, mantienen su forma y representan perfectamente la imagen de nuestra clínica.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=85',
  },
  {
    id: 2,
    author: 'Carlos Rodríguez',
    role: 'Director de restaurante',
    text: 'El proceso fue rápido y muy personalizado. Cada detalle quedó exactamente como lo imaginamos y el equipo luce profesional todos los días.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=85',
  },
  {
    id: 3,
    author: 'Andrea Martínez',
    role: 'Administradora de hotel',
    text: 'Desde el diseño hasta la entrega recibimos una atención excepcional. Las telas son duraderas y el acabado de cada prenda es impecable.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=85',
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="testimonials-heading">
        <div>
          <span className="testimonials-eyebrow">Experiencias reales</span>
          <h2>Lo que dicen nuestros clientes</h2>
        </div>
        <p>
          Marcas que confían en nosotros para proyectar una imagen
          profesional, cómoda y auténtica.
        </p>
      </div>

      <div className="testimonials-grid">
        {quotes.map((q) => (
          <article className="testimonial-card" key={q.id}>
            <div className="testimonial-card-header">
              <FontAwesomeIcon icon={faQuoteLeft} className="testimonial-quote" />
              <div className="testimonial-rating" aria-label="5 estrellas">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon icon={faStar} key={star} />
                ))}
              </div>
            </div>

            <blockquote>
              <p>“{q.text}”</p>
            </blockquote>

            <div className="testimonial-author">
              <img src={q.image} alt={q.author} />
              <div>
                <strong>{q.author}</strong>
                <span>{q.role}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
