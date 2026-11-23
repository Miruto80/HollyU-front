import { Link } from 'react-router-dom';
import "../../assets/css/PromoStrip.css";
import { useGetFetch } from "../../hooks/useGetFetch";

export default function PromoStrip() {
  const { data: descuentos = [] } = useGetFetch("/descuentos");
  const now = new Date();
  const descuentosActivos = descuentos
    .filter((descuento) => {
      if (!descuento.activo) return false;

      const fechaInicio = descuento.fecha_inicio ? new Date(descuento.fecha_inicio) : null;
      const fechaFin = descuento.fecha_fin ? new Date(descuento.fecha_fin) : null;
      const tieneProductos = Array.isArray(descuento.Productos) && descuento.Productos.length > 0;
      const tieneAlcance = descuento.categoria_id != null || tieneProductos;

      return (
        tieneAlcance &&
        (!fechaInicio || now >= fechaInicio) &&
        (!fechaFin || now <= fechaFin)
      );
    })
    .slice(0, 4);

  const renderDescuento = (descuento) => {
    const esPorcentaje = descuento.Tipos_descuento?.nombre
      ?.toLowerCase()
      .includes("porcentaje");

    return (
      <span className="promo-strip-item" key={descuento.id}>
        <strong>{descuento.nombre}</strong>
        {" — "}
        {esPorcentaje
          ? `${Number(descuento.valor).toLocaleString("es-PE")}% de descuento`
          : `S/${Number(descuento.valor).toLocaleString("es-PE")} de descuento`}
      </span>
    );
  };

  return (
    <div className="promo-strip" role="region" aria-label="Promociones">
      <div className="container">
        <div className="promo-strip-content">
          {descuentosActivos.length > 0 ? (
            <div className="promo-strip-ticker">
              <div className="promo-strip-track">
                {Array.from({ length: 8 }, (_, copyIndex) => (
                  <div
                    className="promo-strip-group"
                    key={copyIndex}
                    aria-hidden={copyIndex > 0}
                  >
                    {descuentosActivos.map(renderDescuento)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <span className="promo-strip-fallback">
              Envío gratis en pedidos sobre S/150 —
            </span>
          )}
          <Link to="/catalog" className="promo-strip-link">
            {descuentosActivos.length > 0 ? "Ver promociones" : "Ver ofertas"}
          </Link>
        </div>
      </div>
    </div>
  );
}
