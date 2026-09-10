import { useGetFetch } from "../../hooks/useGetFetch";

export default function OrderModal({ pedidoId, show, onClose }) {
  const { data: pedido, loading } = useGetFetch(
    show && pedidoId ? `/pedidos/${pedidoId}` : null,
    [pedidoId, show]
  );

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header" style={{ background: "#f4a896" }}>
            <h5 className="modal-title text-white">Detalles del Pedido</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading || !pedido ? (
              <p>Cargando...</p>
            ) : (
              <div className="accordion" id="pedidoAccordion">

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#fechaHora">
                      📅 Fecha y Hora
                    </button>
                  </h2>
                  <div id="fechaHora" className="accordion-collapse collapse show" data-bs-parent="#pedidoAccordion">
                    <div className="accordion-body">
                      <p><strong>Creado:</strong> {new Date(pedido.fecha).toLocaleString()}</p>
                      <p className="mb-0"><strong>Entrega estimada:</strong> {pedido.fecha_entrega_estimada ? new Date(pedido.fecha_entrega_estimada).toLocaleDateString() : "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#infoCliente">
                      👤 Información del Cliente
                    </button>
                  </h2>
                  <div id="infoCliente" className="accordion-collapse collapse" data-bs-parent="#pedidoAccordion">
                    <div className="accordion-body">
                      <p><strong>Nombre:</strong> {pedido.Cliente?.nombres} {pedido.Cliente?.apellidos}</p>
                      <p><strong>Email:</strong> {pedido.Cliente?.email ?? "-"}</p>
                      <p className="mb-0"><strong>Teléfono:</strong> {pedido.Cliente?.telefono ?? "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#pagoEntrega">
                      💳 Pago y Entrega
                    </button>
                  </h2>
                  <div id="pagoEntrega" className="accordion-collapse collapse" data-bs-parent="#pedidoAccordion">
                    <div className="accordion-body">
                      {pedido.Pagos?.map(pago => (
                        <div key={pago.id}>
                          <p><strong>Método:</strong> {pago.Metodos_pago?.nombre}</p>
                          <p><strong>Referencia:</strong> {pago.referencia}</p>
                          <p><strong>Banco origen:</strong> {pago.banco_origen} → <strong>destino:</strong> {pago.banco_destino}</p>
                          <p><strong>Teléfono emisor:</strong> {pago.telefono_emisor}</p>
                          <p><strong>Estado:</strong> {pago.Estados_pago?.nombre}</p>
                          {pago.comprobante && (
                            <a href={`${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")}${pago.comprobante}`} target="_blank" rel="noreferrer">
                              Ver comprobante
                            </a>
                          )}
                        </div>
                      ))}
                      <p className="mb-0"><strong>Total pagado:</strong> {Number(pedido.total_bs || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} Bs</p>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#detalleVenta">
                      🛍️ Detalles de la Venta
                    </button>
                  </h2>
                  <div id="detalleVenta" className="accordion-collapse collapse" data-bs-parent="#pedidoAccordion">
                    <div className="accordion-body">
                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th className="text-end">Cantidad</th>
                              <th className="text-end">Precio ($)</th>
                              <th className="text-end">Subtotal ($)</th>
                              <th className="text-end">Descuento ($)</th>
                              <th className="text-end">Total ($)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pedido.Detalle_pedidos?.map(item => (
                              <tr key={item.id}>
                                <td>
                                  <strong>{item.Producto?.nombre}</strong>
                                  <div className="text-muted small">
                                    {item.Modelo?.nombre} · {item.Tipos_tela?.nombre} · Talla {item.Talla?.nombre}
                                  </div>
                                </td>
                                <td className="text-end">{item.cantidad}</td>
                                <td className="text-end">${Number(item.precio || 0).toLocaleString()}</td>
                                <td className="text-end">${(Number(item.cantidad || 0) * Number(item.precio || 0)).toLocaleString()}</td>
                                <td className="text-end">${Number(item.descuento || 0).toLocaleString()}</td>
                                <td className="text-end">${Math.max(0, Number(item.cantidad || 0) * Number(item.precio || 0) - Number(item.descuento || 0)).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex justify-content-between mt-3">
                        <strong>Subtotal:</strong>
                        <strong>${Number(pedido.subtotal || 0).toLocaleString()}</strong>
                      </div>
                      <div className="d-flex justify-content-between text-danger">
                        <strong>Descuento aplicado:</strong>
                        <strong>-${Number(pedido.descuento || 0).toLocaleString()}</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong>Total:</strong>
                        <strong>${Number(pedido.total || 0).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}