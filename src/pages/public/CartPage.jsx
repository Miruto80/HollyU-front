import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import StepIndicator from "../../components/home/StepIndicator";
import { SERVER_URL } from "../../services/api";
import "../../assets/css/CartFlow.css";

const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`;

export default function CartPage() {
  const navigate = useNavigate();
  const { items, totalPrecio, updateCantidad, removeItem } = useCart();

  const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);

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

            {items.map((item) => (
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
                    {(item.talla_nombre || item.color_nombre) && (
                      <div className="cart-flow-product-details">
                        {item.talla_nombre && <span>Talla: {item.talla_nombre}</span>}
                        {item.color_nombre && <span>Color: {item.color_nombre}</span>}
                      </div>
                    )}
                  </div>
                </div>

                <span className="cart-flow-price">{formatMoney(item.precio)}</span>

                <div className="cart-flow-qty">
                  <button type="button" onClick={() => updateCantidad(item.id, item.cantidad - 1)}>-</button>
                  <span>{item.cantidad}</span>
                  <button type="button" onClick={() => updateCantidad(item.id, item.cantidad + 1)}>+</button>
                </div>

                <span className="cart-flow-subtotal">{formatMoney(item.cantidad * Number(item.precio || 0))}</span>
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

            <div className="cart-flow-total-row">
              <span>Total a pagar:</span>
              <strong>{formatMoney(totalPrecio)}</strong>
            </div>

            <button type="button" className="cart-flow-primary" onClick={() => navigate("/entrega")}>
              Continuar con la Compra
            </button>

            <button type="button" className="cart-flow-secondary" onClick={() => navigate("/catalog")}>
              Reservar Productos
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
