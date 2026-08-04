import "../../assets/css/Catalog.css";
import hero from "../../assets/img/hero.png";
import { SERVER_URL } from "../../services/api";

export default function ProductCard({ product, onClick }) {
  const imagenRelativa = product.Producto_imagenes?.[0]?.imagen;

  const image = imagenRelativa
    ? `${SERVER_URL}${imagenRelativa}`
    : hero;

  const precio = product.Modelos?.[0]?.Modelo_telas?.[0]?.precio;

  return (
    <div className="product-card card h-100" onClick={onClick}>

      <div className="product-image">

        <img
          src={image}
          alt={product.nombre}
        />

        <span className="product-badge">
            {product.Categoria?.nombre}        </span>

      </div>

      <div className="card-body">

  <h5 className="product-title">
    {product.nombre}
  </h5>

  <div className="product-price">
    ${Number(precio).toLocaleString()}
  </div>

  <button className="btn product-btn w-100">
    Ver detalles
  </button>

</div>
    </div>
  );
}