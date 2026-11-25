import "../../assets/css/Catalog.css";
import hero from "../../assets/img/hero.png";
import { SERVER_URL } from "../../services/api";
import { useGetFetch } from "../../hooks/useGetFetch";
import { CANTIDAD_MINIMA_MAYOR } from "../../utils/Pricing";
import { getDiscountForProduct } from "../../utils/Discounts";

const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`;

export default function ProductCard({ product, onClick }) {
  const imagenRelativa = product.Producto_imagenes?.[0]?.imagen;
  const { data: descuentos = [] } = useGetFetch("/descuentos");

  const image = imagenRelativa ? `${SERVER_URL}${imagenRelativa}` : hero;
  const precio = Number(product.precio || 0);
  const precioMayor = Number(product.precio_mayor || 0);
  const descuento = getDiscountForProduct(product, descuentos, precio);
  const montoDescuento = descuento ? Math.min(precio, Math.max(0, descuento.amountPerUnit)) : 0;
  const precioConDescuento = Math.max(0, precio - montoDescuento);
  const tieneDescuento = montoDescuento > 0;

  return (
    <div className="product-card card h-100" onClick={onClick}>
      <div className="product-image">
        <img src={image} alt={product.nombre} />

        {tieneDescuento && (
          <span className="product-discount-banner">-{descuento.badge}</span>
        )}

        <span className="product-badge">
          {product.Categoria?.nombre}
        </span>
      </div>

      <div className="card-body">
        <h5 className="product-title">{product.nombre}</h5>

        <div className="product-pricing">
          <span className="product-price-label">Precio por unidad</span>
          <div className="product-price-container">
            <span className="product-price">
              {formatMoney(tieneDescuento ? precioConDescuento : precio)}
            </span>
            {tieneDescuento && (
              <del className="product-price-original">{formatMoney(precio)}</del>
            )}
          </div>
          {precioMayor > 0 && (
            <div className="product-wholesale-price">
              <span>Mayorista · desde {CANTIDAD_MINIMA_MAYOR} unidades</span>
              <strong>{formatMoney(precioMayor)} c/u</strong>
            </div>
          )}
        </div>

        <button className="btn product-btn w-100">Ver detalles</button>
      </div>
    </div>
  );
}