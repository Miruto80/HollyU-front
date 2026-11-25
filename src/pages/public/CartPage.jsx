import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useCart } from "../../hooks/useCart";
import { useGetFetch } from "../../hooks/useGetFetch";
import StepIndicator from "../../components/home/StepIndicator";
import { SERVER_URL } from "../../services/api";
import { getUnitPrice, esPrecioMayor } from "../../utils/Pricing";
import { getDiscountedItemPricing } from "../../utils/Discounts";
import "../../assets/css/CartFlow.css";

const formatMoney = (value) => `$ ${Number(value || 0).toLocaleString()}`;

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateCantidad, removeItem } = useCart();
  const { data: descuentos = [] } = useGetFetch("/descuentos");

  const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);

  const itemsWithDiscount = items.map((item) => {
    const pricing = getDiscountedItemPricing(item, descuentos, item.cantidad, getUnitPrice(item));

    return {
      ...item,
      ...pricing,
      esMayor: esPrecioMayor(item),
      discountLabel: pricing.discountInfo?.label || ""
    };
  });

  const totalDiscount = itemsWithDiscount.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalAfterDiscount = itemsWithDiscount.reduce((sum, item) => sum + item.discountedSubtotal, 0);

  if (items.length === 0) {
    return (
      <main className="cart-flow-page cart-flow-empty">
        <div className="cart-flow-container text-center">
          <StepIndicator pasoActual={1} />
          <div className="cart-flow-empty-card">
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para continuar con tu compra.</p>
            <button className="cart-flow-primary" onClick={() => navigate("/catalog")}>
              Ir al catálogo
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-flow-page">
      <div className="cart-flow-container">
        <h1 className="cart-flow-title">Carrito de compra</h1>
        <p className="cart-flow-subtitle">Revisa tus productos antes de procesar el pedido</p>

        <StepIndicator pasoActual={1} />

        <div className="cart-flow-layout">
          <section className="cart-flow-main-panel">
            <div className="cart-flow-table-head">
              <span>Acción</span>
              <span>Producto</span>
              <span className="text-center">Precio</span>
              <span className="text-center">Cantidad</span>
              <span className="text-center">Subtotal</span>
            </div>

            {itemsWithDiscount.map((item, index) => (
              <div 
                className="cart-flow-item-row" 
                key={item.idCart || `${item.id}-${item.modelo || index}`}
              >
                <button
                  type="button"
                  className="cart-flow-remove"
                  onClick={() => removeItem(item.id, item.modelo)}
                  aria-label={`Eliminar ${item.nombre}`}
                >
                  ×
                </button>

                <div className="cart-flow-product">
                  <img
                    src={item.imagen ? `${SERVER_URL}${item.imagen}` : "/images/no-image.jpg"}
                    alt={item.nombre}
                  />
                  <div className="cart-flow-product-meta">
                    <strong>{item.nombre}</strong>
                    

                    {(item.modelo || item.talla_nombre || item.color_nombre || item.tipo_bota_nombre) && (
                      <div className="cart-flow-product-details">
                        {item.modelo && <span>Modelo: {item.modelo}</span>}
                        {item.talla_nombre && <span>Talla: {item.talla_nombre}</span>}
                        {item.color_nombre && <span>Color: {item.color_nombre}</span>}
                        {item.tipo_bota_nombre && <span>Bota: {item.tipo_bota_nombre}</span>}
                      </div>
                    )}

                    {item.esMayor && (
                      <span className="cart-flow-discount-tag">Precio al mayor aplicado</span>
                    )}
                    {item.discountLabel && (
                      <span className="cart-flow-discount-tag">{item.discountLabel}</span>
                    )}
                  </div>
                </div>

                <div className="cart-flow-price text-center">
                  <span>{formatMoney(item.discountedUnitPrice)}</span>
                  {item.discountAmount > 0 && (
                    <del className="cart-flow-price-original">{formatMoney(item.unitPrice)}</del>
                  )}
                </div>

                <div className="cart-flow-qty">
                  <button type="button" onClick={() => updateCantidad(item.id, item.cantidad - 1, item.modelo)}>-</button>
                  <span>{item.cantidad}</span>
                  <button type="button" onClick={() => updateCantidad(item.id, item.cantidad + 1, item.modelo)}>+</button>
                </div>

                <div className="cart-flow-subtotal-box">
                  <span className="cart-flow-subtotal">{formatMoney(item.discountedSubtotal)}</span>
                  {item.discountAmount > 0 && (
                    <small className="cart-flow-discount-amount">-{formatMoney(item.discountAmount)}</small>
                  )}
                </div>
              </div>
            ))}

            <button type="button" className="cart-flow-back-btn" onClick={() => navigate("/catalog")}>
               <FontAwesomeIcon icon={faArrowLeft} className="ms-2" /> Seguir buscando
            </button>
          </section>

          <aside className="cart-flow-summary">
            <h3>Resumen del Pedido</h3>

            <div className="cart-flow-summary-row">
              <span>Cantidad de artículos:</span>
              <span>{cantidadTotal} unidad(es)</span>
            </div>

            {totalDiscount > 0 && (
              <div className="cart-flow-summary-row cart-flow-summary-discount">
                <span>Descuento aplicado:</span>
                <span>-{formatMoney(totalDiscount)}</span>
              </div>
            )}

            <div className="cart-flow-total-row">
              <span>Total a pagar:</span>
              <span><strong>{formatMoney(totalAfterDiscount)}</strong></span>
            </div>

            <button type="button" className="cart-flow-primary" onClick={() => navigate("/entrega")}>
              Continuar con la Compra
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}