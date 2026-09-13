import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useGetFetch } from "../../hooks/useGetFetch";
import StepIndicator from "../../components/home/StepIndicator";
import { SERVER_URL } from "../../services/api";
import "../../assets/css/CartFlow.css";

const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`;

const getDiscountForItem = (item, descuentos) => {
  const now = new Date();

  const aplicables = (descuentos || []).filter((descuento) => {
    if (!descuento.activo) return false;

    const fechaInicio = descuento.fecha_inicio
      ? new Date(descuento.fecha_inicio)
      : null;

    const fechaFin = descuento.fecha_fin
      ? new Date(descuento.fecha_fin)
      : null;

    if (fechaInicio && now < fechaInicio) return false;
    if (fechaFin && now > fechaFin) return false;


    const categoryMatch =
      descuento.categoria_id !== null &&
      descuento.categoria_id !== undefined &&
      item.categoria_id !== null &&
      item.categoria_id !== undefined &&
      Number(descuento.categoria_id) === Number(item.categoria_id);

    
    const productMatch =
      Array.isArray(descuento.Productos) &&
      descuento.Productos.some(
        (producto) =>
          Number(producto.id) === Number(item.producto_id)
      );

    return categoryMatch || productMatch;
  });

  if (aplicables.length === 0) {
    return {
      discountAmount: 0,
      discountLabel: ""
    };
  }

  const descuento = aplicables[0];

  const basePrice = Number(item.precio || 0);
  const quantity = Number(item.cantidad || 1);
  const valor = Number(descuento.valor || 0);

  if (descuento.Tipos_descuento?.nombre === "Porcentaje") {
    const descuentoUnitario = basePrice * (valor / 100);

    return {
      discountAmount: descuentoUnitario * quantity,
      discountLabel: `${valor.toFixed(2)}% de descuento`
    };
  }

  const discountAmount = valor * quantity;

  return {
    discountAmount,
    discountLabel: `$${valor.toLocaleString()} de descuento`
  };
};

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalPrecio, updateCantidad, removeItem } = useCart();
  const { data: descuentos = [] } = useGetFetch("/descuentos");

  const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);

  const itemsWithDiscount = items.map((item) => {
    const discountInfo = getDiscountForItem(item, descuentos);
    const unitPrice = Number(item.precio || 0);
    const subtotal = item.cantidad * unitPrice;
    const discountedSubtotal = Math.max(0, subtotal - discountInfo.discountAmount);

    return {
      ...item,
      subtotal,
      discountAmount: discountInfo.discountAmount,
      discountedSubtotal,
      discountLabel: discountInfo.discountLabel
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
              <span>Precio</span>
              <span>Cantidad</span>
              <span>Subtotal</span>
            </div>

            {itemsWithDiscount.map((item) => (
              <div className="cart-flow-item-row" key={item.id}>
                <button
                  type="button"
                  className="cart-flow-remove"
                  onClick={() => removeItem(item.id)}
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
                    {(item.talla_nombre || item.color_nombre || item.tipo_bota_nombre) && (
                      <div className="cart-flow-product-details">
                        {item.talla_nombre && <span>Talla: {item.talla_nombre}</span>}
                        {item.color_nombre && <span>Color: {item.color_nombre}</span>}
                        {item.tipo_bota_nombre && <span>Bota: {item.tipo_bota_nombre}</span>}
                      </div>
                    )}
                    {item.discountLabel && (
                      <span className="cart-flow-discount-tag">{item.discountLabel}</span>
                    )}
                  </div>
                </div>

                <span className="cart-flow-price">{formatMoney(item.precio)}</span>

                <div className="cart-flow-qty">
                  <button type="button" onClick={() => updateCantidad(item.id, item.cantidad - 1)}>-</button>
                  <span>{item.cantidad}</span>
                  <button type="button" onClick={() => updateCantidad(item.id, item.cantidad + 1)}>+</button>
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
              ← Seguir buscando
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
              <strong>{formatMoney(totalAfterDiscount || totalPrecio)}</strong>
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
