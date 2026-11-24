import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import api from "../../services/api";
import { notifySuccess } from "../../utils/Tostify";
import { confirmarAccion, alertaExito, alertaError } from "../../utils/Alert";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import DataCardList from "../../components/common/DataCardList";
import OrderModal from "../../components/admin/OrderModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faClipboardList,

} from "@fortawesome/free-solid-svg-icons";
const ESTADO_PAGO_VERIFICADO = 2;
const ESTADO_PAGO_RECHAZADO = 3;

export default function Orders() {
  const { data: pedidos, loading, error, refetch } = useGetFetch("/pedidos");

  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const handleView = (id) => {
    setPedidoSeleccionadoId(id);
    setShowDetalle(true);
  };

  const handleConfirm = async (id) => {
    const ok = await confirmarAccion({
      titulo: "¿Confirmar este pago?",
      texto: "Se verificará el comprobante",
      icon: "question"
    });
    if (!ok) return;

    try {
      const { data: pedidoActualizado } = await api.patch(`/pedidos/${id}/estado-pago`, {
        estado_pago_id: ESTADO_PAGO_VERIFICADO
      });

      const listoParaEntrega = pedidoActualizado.Estados_pedido?.nombre === "Listo para entrega";

      await alertaExito(
        listoParaEntrega ? "¡Pedido listo para entregar!" : "Pago confirmado",
        listoParaEntrega
          ? "Había stock suficiente, no requiere producción."
          : "Algunos productos no tienen stock, el pedido pasó a producción."
      );

      refetch();
    } catch {
      alertaError("Error", "No se pudo confirmar el pago");
    }
  };

  const handleReject = async (id) => {
    const ok = await confirmarAccion({
      titulo: "¿Rechazar este pago?",
      texto: "El pedido se marcará como cancelado",
      icon: "warning"
    });
    if (!ok) return;

    try {
      await api.patch(`/pedidos/${id}/estado-pago`, {
        estado_pago_id: ESTADO_PAGO_RECHAZADO
      });
      notifySuccess("Pago rechazado");
      refetch();
    } catch {
      alertaError("Error", "No se pudo rechazar el pago");
    }
  };

  const handleAdvance = async (id) => {
    const ok = await confirmarAccion({
      titulo: "¿Cambiar el estado de entrega?",
      texto: "El pedido avanzará al siguiente estado",
      icon: "question"
    });
    if (!ok) return;

    try {
      const { data: pedidoActualizado } = await api.patch(`/pedidos/${id}/avanzar-estado`);
      alertaExito(
        "Estado actualizado",
        `El pedido ahora está: ${pedidoActualizado.Estados_pedido?.nombre ?? "actualizado"}`
      );
      refetch();
    } catch {
      alertaError("Error", "No se pudo cambiar el estado de entrega");
    }
  };

  const columns = [
    { title: "ID", data: "id" },
    {
      title: "Fecha",
      data: "fecha",
      render: (f) => new Date(f).toLocaleString()
    },
    {
      title: "Estatus",
      data: null,
      render: (d) => {
        const estadoPago = d.Pagos?.[0]?.Estados_pago?.nombre;
        const estadoPedido = d.Estados_pedido?.nombre;
        if (estadoPago === "Pendiente de verificación") {
          return '<span class="badge bg-warning text-dark">VERIFICAR PAGO</span>';
        }
        if (estadoPago === "Rechazado") {
          return '<span class="badge bg-danger">PAGO RECHAZADO</span>';
        }
        return `<span class="badge ${estadoPago === "Verificado" ? "bg-primary" : "bg-secondary"}">${estadoPedido ?? "-"}</span>`;
      }
    },
    {
      title: "Total ($)",
      data: "total",
      render: (val) => `$${Number(val || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    },
    {
      title: "Referencia",
      data: null,
      render: (d) => d.Pagos?.[0]?.referencia ?? "-"
    },
    {
      title: "Cliente",
      data: null,
      render: (d) => d.Cliente ? `${d.Cliente.nombres} ${d.Cliente.apellidos ?? ""}` : "-"
    },
    {
  title: "Acción",
  data: null,
  orderable: false,
  render: (_, __, d) => {
    const estadoPago = d.Pagos?.[0]?.Estados_pago?.nombre;
    const estadoPedido = d.Estados_pedido?.nombre;
    const esPedidoDeCotizacion = Boolean(d.cotizacion_id);

    const producciones = d.Producciones || [];

    const produccionTerminada =
      producciones.length > 0 &&
      producciones.every(
        (produccion) =>
          produccion.Estados_produccion?.nombre === "Terminado"
      );

    const accionesPago =
      estadoPago === "Pendiente de verificación"
        ? `
          <button
            class="btn btn-sm btn-success btn-confirmar"
            data-id="${d.id}"
            title="Confirmar pago"
          >
            ✓
          </button>

          <button
            class="btn btn-sm btn-danger btn-rechazar"
            data-id="${d.id}"
            title="Rechazar pago"
          >
            ✕
          </button>
        `
        : "";

    let botonAvanzar = "";
    if (
      estadoPedido === "En producción" &&
      produccionTerminada &&
      (estadoPago === "Verificado" || esPedidoDeCotizacion)
    ) {
      botonAvanzar = `
        <button
          class="btn btn-sm btn-primary btn-avanzar"
          data-id="${d.id}"
          title="Cambiar estado de entrega"
        >
          Listo para entrega
        </button>
      `;
    }

    if (
      estadoPedido === "Listo para entrega" &&
      (estadoPago === "Verificado" || esPedidoDeCotizacion)
    ) {
      botonAvanzar = `
        <button
          class="btn btn-sm btn-primary btn-avanzar"
          data-id="${d.id}"
          title="Marcar como entregado"
        >
          Entregado
        </button>
      `;
    }

    return `
      <button
        class="btn btn-sm btn-info text-white btn-ver-pedidos"
        data-id="${d.id}"
        title="Ver detalle"
      >
        Ver
      </button>

      ${botonAvanzar}

      ${accionesPago}
    `;
  }
}
  ];

  return (
    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
              <h3 className="card-title m-0 fw-bold text-dark"> <FontAwesomeIcon icon={faClipboardList} style={{ color: "#ffc107" }} /> Pedidos</h3>
            </div>

            <div className="d-none d-lg-block">
              <ReusableDataTable
                data={pedidos}
                columns={columns}
                loading={loading}
                error={error}
                onView={handleView}
                onConfirm={handleConfirm}
                onReject={handleReject}
                onAvanzar={handleAdvance}
                options={{
                  columnDefs: [
                    { targets: 0, className: "text-center" },
                    { targets: 1, className: "text-start" },
                    { targets: 2, className: "text-start" },
                    { targets: 3, className: "text-start" },
                    { targets: 4, className: "text-start" },
                    { targets: 5, className: "text-start" },
                    { targets: 6, className: "text-start" }
                  ],
                  language: {
                    search: "Buscador:",
                    lengthMenu: "Mostrar _MENU_ registros",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    zeroRecords: "No se encontraron resultados",
                    paginate: {
                      previous: "Anterior",
                      next: "Siguiente"
                    }
                  }
                }}
                className="table table-striped table-hover mb-0 custom-table"
              />
            </div>
            <div className="d-block d-lg-none">
              <DataCardList
                data={pedidos}
                loading={loading}
                error={error}
                emptyMessage="No se encontraron pedidos"
                renderCard={(item) => {
                  const estadoPago = item.Pagos?.[0]?.Estados_pago?.nombre;
                  const estadoPedido = item.Estados_pedido?.nombre;
                  const esPedidoDeCotizacion = Boolean(item.cotizacion_id);
                  const producciones = item.Producciones || [];
                  const produccionTerminada = producciones.length > 0
                    && producciones.every((produccion) => produccion.Estados_produccion?.nombre === "Terminado");
                  const puedeAvanzar = (
                    estadoPedido === "En producción"
                    && produccionTerminada
                    && (estadoPago === "Verificado" || esPedidoDeCotizacion)
                  ) || (
                    estadoPedido === "Listo para entrega"
                    && (estadoPago === "Verificado" || esPedidoDeCotizacion)
                  );
                  const estadoClass = estadoPago === "Pendiente de verificación"
                    ? "bg-warning text-dark"
                    : estadoPago === "Rechazado"
                      ? "bg-danger"
                      : estadoPago === "Verificado"
                        ? "bg-primary"
                        : "bg-secondary";
                  const nombreCliente = item.Cliente
                    ? `${item.Cliente.nombres || ""} ${item.Cliente.apellidos || ""}`.trim()
                    : "-";

                  return (
                    <>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge bg-light text-dark border me-2">ID: {item.id}</span>
                          <h5 className="mb-1 fw-bold text-dark d-inline-block">{nombreCliente}</h5>
                        </div>
                        <span className={`badge ${estadoClass}`}>
                          {estadoPago === "Pendiente de verificación"
                            ? "VERIFICAR PAGO"
                            : estadoPago === "Rechazado"
                              ? "PAGO RECHAZADO"
                              : estadoPedido || "-"}
                        </span>
                      </div>
                      <div className="row small text-muted g-2">
                        <div className="col-12"><strong>Fecha:</strong> {new Date(item.fecha).toLocaleString()}</div>
                        <div className="col-6"><strong>Total:</strong> ${Number(item.total || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        <div className="col-6"><strong>Referencia:</strong> {item.Pagos?.[0]?.referencia ?? "-"}</div>
                      </div>
                      <div className="d-flex flex-wrap justify-content-end gap-2 border-top pt-2 mt-3">
                        <button className="btn btn-sm btn-info text-white" onClick={() => handleView(item.id)}>
                          Ver
                        </button>
                        {estadoPago === "Pendiente de verificación" && (
                          <>
                            <button className="btn btn-sm btn-success" onClick={() => handleConfirm(item.id)}>
                              Confirmar
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleReject(item.id)}>
                              Rechazar
                            </button>
                          </>
                        )}
                        {puedeAvanzar && (
                          <button className="btn btn-sm btn-primary" onClick={() => handleAdvance(item.id)}>
                            {estadoPedido === "Listo para entrega" ? "Entregado" : "Listo para entrega"}
                          </button>
                        )}
                      </div>
                    </>
                  );
                }}
              />
            </div>

            <OrderModal
              pedidoId={pedidoSeleccionadoId}
              show={showDetalle}
              onClose={() => setShowDetalle(false)}
            />
        </div>
      </div>
    </div>
  );
}