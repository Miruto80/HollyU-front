import React from 'react';

const faqs = [
  { q: '¿Cómo encargo un uniforme a medida?', a: 'Puedes ir a la sección de Catálogo, elegir un modelo y seleccionar la opción "A medida" o contactar a ventas para coordinar tallas y acabados.' },
  { q: '¿Cuál es el tiempo de entrega?', a: 'El tiempo estándar de producción es de 7 a 14 días hábiles, puede variar según la personalización y la temporada.' },
  { q: '¿Ofrecen descuentos por volumen?', a: 'Sí, ofrecemos descuentos por pedidos corporativos. Contacta a nuestro equipo de ventas para cotización.' },
  { q: '¿Puedo devolver o cambiar mi pedido?', a: 'Revisamos caso por caso. Las devoluciones por talla se gestionan según nuestras políticas; prendas a medida no suelen ser retornables.' },
];

export default function FAQ() {
  return (
    <div className="faq">
      <h2 className="mb-3">Preguntas frecuentes</h2>
      <div className="accordion" id="faqAccordion">
        {faqs.map((item, idx) => (
          <details key={idx} className="mb-2 p-3 border rounded">
            <summary className="fw-semibold" aria-expanded="false">{item.q}</summary>
            <div className="mt-2 text-muted">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
