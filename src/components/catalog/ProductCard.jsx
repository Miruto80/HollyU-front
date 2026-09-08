import "../../assets/css/Catalog.css";
import hero from "../../assets/img/hero.png";
import { SERVER_URL } from "../../services/api";
import { useGetFetch } from "../../hooks/useGetFetch";

const getDiscountForProduct = (product, descuentos = []) => {
  const now = new Date();

  const aplicable = (descuentos || []).find((descuento) => {
    if (!descuento.activo) return false;

    const fechaInicio = descuento.fecha_inicio ? new Date(descuento.fecha_inicio) : null;
    const fechaFin = descuento.fecha_fin ? new Date(descuento.fecha_fin) : null;

    if (fechaInicio && now < fechaInicio) return false;
    if (fechaFin && now > fechaFin) return false;

    const categoryMatch =
      descuento.categoria_id != null &&
      Number(descuento.categoria_id) === Number(product.categoria_id ?? product.Categoria?.id);

    const productMatch =
      Array.isArray(descuento.Productos) &&
      descuento.Productos.some((item) => Number(item.id) === Number(product.id));

    return categoryMatch || productMatch;
  });

  if (!aplicable) return null;

  if (aplicable.Tipos_descuento?.nombre === "Porcentaje") {
    return Number(aplicable.valor || 0);
  }

  return null;
};

export default function ProductCard({ product, onClick }) {
  const imagenRelativa = product.Producto_imagenes?.[0]?.imagen;
  const { data: descuentos = [] } = useGetFetch("/descuentos");

  const image = imagenRelativa ? `${SERVER_URL}${imagenRelativa}` : hero;
  const precio = product.precio;
  const descuento = getDiscountForProduct(product, descuentos);

  return (
    <div className="product-card card h-100" onClick={onClick}>
      <div className="product-image">
        <img src={image} alt={product.nombre} />

        {descuento && (
          <span className="product-discount-banner">-{descuento}%</span>
        )}

        <span className="product-badge">
          {product.Categoria?.nombre}
        </span>
      </div>

      <div className="card-body">
        <h5 className="product-title">{product.nombre}</h5>

        <div className="product-price">
          ${Number(precio).toLocaleString()}
        </div>

        <button className="btn product-btn w-100">Ver detalles</button>
      </div>
    </div>
  );
}