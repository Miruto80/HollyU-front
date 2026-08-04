import React from 'react';

const quotes = [
  { id: 1, author: 'María L.', text: 'Calidad y atención impecable. Mis uniformes duran años.' },
  { id: 2, author: 'Carlos R.', text: 'Encargo rápido y la talla quedó perfecta. 100% recomendable.' },
];

export default function Testimonials() {
  return (
    <div className="testimonials">
      <h2 className="mb-3">Lo que dicen nuestros clientes</h2>
      <div className="row">
        {quotes.map((q) => (
          <div key={q.id} className="col-12 col-md-6">
            <blockquote className="blockquote p-3 border rounded">
              <p className="mb-2">“{q.text}”</p>
              <footer className="blockquote-footer">{q.author}</footer>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}
