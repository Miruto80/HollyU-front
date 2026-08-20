import { Link, useParams } from "react-router-dom";
import { useGetFetch } from "../../hooks/useGetFetch";
import StepIndicator from "../../components/home/StepIndicator";
import "../../assets/css/OrderConfirmation.css";

const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

export default function OrderConfirmation() {
  const { id } = useParams();
  const { data: pedido, loading, error } = useGetFetch(`/pedidos/${id}`);

  if (loading) {
    return (
      <main className="order-confirmation-page">
        <StepIndicator pasoActual={4} />
        <div className="order-confirmation-loading">Cargando confirmación...</div>
      </main>
    );
  }

  if (error || !pedido) {
    return (
      <main className="order-confirmation-page">
        <StepIndicator pasoActual={4} />
        <section className="order-confirmation-card text-center">
          <h1>No pudimos cargar tu pedido</h1>
          <p className="text-muted">Verifica el número del pedido o vuelve al catálogo.</p>
          <Link to="/catalog" className="order-confirmation-button">Volver al catálogo</Link>
        </section>
      </main>
    );
  }

  const detalles = pedido.Detalle_pedidos || [];
  const estado = pedido.Estados_pedido?.nombre || "Pendiente de confirmación";

  return (
    <main className="order-confirmation-page">
      <StepIndicator pasoActual={4} />

      <div className="container">
        <section className="order-confirmation-card text-center">
          <div className="order-confirmation-check" aria-hidden="true">✓</div>
          <p className="order-confirmation-eyebrow">Pedido recibido</p>
          <h1>¡Gracias por tu compra!</h1>
          <p className="order-confirmation-intro">
            Hemos recibido tu comprobante. Revisaremos el pago y te avisaremos cuando sea confirmado.
          </p>

          <div className="order-confirmation-number">
            <span>Número de pedido</span>
            <strong>#{pedido.id}</strong>
          </div>
        </section>

        <div className="row g-4 mt-1">
          <div className="col-lg-7">
            <section className="order-confirmation-panel">
              <h2>Resumen del pedido</h2>
              {detalles.map((detalle) => (
                <div className="order-confirmation-item" key={detalle.id}>
                  <div>
                    <strong>{detalle.Producto?.nombre || "Producto personalizado"}</strong>
                    <p>
                      {detalle.Talla?.nombre && `Talla: ${detalle.Talla.nombre}`}
                      {detalle.Color?.nombre && ` · Color: ${detalle.Color.nombre}`}
                    </p>
                  </div>
                  <div className="text-end">
                    <span>{detalle.cantidad} × {formatCurrency(detalle.precio)}</span>
                    <strong>{formatCurrency(detalle.cantidad * detalle.precio)}</strong>
                  </div>
                </div>
              ))}

              <hr />
              <div className="order-confirmation-total">
                <span>Total</span>
                <strong>{formatCurrency(pedido.total)}</strong>
              </div>
              {pedido.total_bs && (
                <div className="order-confirmation-bs">
                  Total pagado en bolívares: {Number(pedido.total_bs).toLocaleString(undefined, { maximumFractionDigits: 2 })} Bs
                </div>
              )}
            </section>
          </div>

          <div className="col-lg-5">
            <section className="order-confirmation-panel order-confirmation-details">
              <h2>Detalles</h2>
              <div><span>Estado</span><strong>{estado}</strong></div>
              <div><span>Entrega estimada</span><strong>{pedido.fecha_entrega_estimada ? new Date(pedido.fecha_entrega_estimada).toLocaleDateString() : "Por confirmar"}</strong></div>
              <div><span>Cliente</span><strong>{pedido.Cliente?.nombres} {pedido.Cliente?.apellidos || ""}</strong></div>
              <div><span>Correo</span><strong>{pedido.Cliente?.email || "-"}</strong></div>
            </section>
          </div>
        </div>

        <div className="text-center order-confirmation-actions">
          <Link to="/catalog" className="order-confirmation-button">Seguir comprando</Link>
        </div>
      </div>
    </main>
  );
}