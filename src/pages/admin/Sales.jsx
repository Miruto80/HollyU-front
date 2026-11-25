import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import DataCardList from "../../components/common/DataCardList";
import { confirmarAccion, alertaExito, alertaError } from "../../utils/Alert";
import api from "../../services/api";
import SalesModal from "../../components/admin/SalesModal";
import OrderModal from "../../components/admin/OrderModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faMoneyBillWave,

} from "@fortawesome/free-solid-svg-icons";

const TIPO_VENTA_PRESENCIAL = 3;

export default function Sales() {
  const { data: ventas, loading, error, refetch } = useGetFetch(
    `/pedidos?tipo_venta_id=${TIPO_VENTA_PRESENCIAL}`
  );

  const [showRegistro, setShowRegistro] = useState(false);
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const handleView = (id) => {
    setPedidoSeleccionadoId(id);
    setShowDetalle(true);
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
      title: "Cliente",
      data: null,
      render: (d) => d.Cliente ? `${d.Cliente.nombres} ${d.Cliente.apellidos ?? ""}` : "-"
    },
    {
      title: "Fecha",
      data: "fecha",
      render: (f) => new Date(f).toLocaleString()
    },
    {
      title: "Total",
      data: "total",
      render: (val) => `$${Number(val).toLocaleString()}`
    },
    {
      title: "Método de pago",
      data: null,
      render: (d) => {
        const metodos = d.Pagos?.map(p => p.Metodos_pago?.nombre).filter(Boolean);
        return metodos?.length ? metodos.join(" + ") : "-";
      }
    },
    {
      title: "Estado",
      data: null,
      render: (d) => `<span class="badge bg-secondary">${d.Estados_pedido?.nombre ?? "-"}</span>`
    },
  {
  title: "Acción",
  data: null,
  orderable: false,
  render: (_, __, d) => {
    const estadoPedido = d.Estados_pedido?.nombre;

    const producciones = d.Producciones || [];

    const produccionTerminada =
      producciones.length > 0 &&
      producciones.every(
        (p) => p.Estados_produccion?.nombre === "Terminado"
      );

    const puedePasarAListo =
      estadoPedido === "En producción" &&
      produccionTerminada;

    const puedePasarAEntregado =
      estadoPedido === "Listo para entrega";

    return `
      <button 
        class="btn btn-sm btn-info text-white btn-ver-pedidos" 
        data-id="${d.id}"
        title="Ver detalle"
      >
        Ver
      </button>

      ${
        puedePasarAListo || puedePasarAEntregado
          ? `
            <button 
              class="btn btn-sm btn-primary btn-avanzar" 
              data-id="${d.id}" 
              title="Cambiar estado de entrega"
            >
              ${
                puedePasarAListo
                  ? "Listo para entrega"
                  : "Entregado"
              }
            </button>
          `
          : ""
      }
    `;
  }
}
  ];

  return (
    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
              <h3 className="card-title m-0 fw-bold text-dark"> <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: "#ffc107" }} /> Ventas Presenciales</h3>
              <button className="btn btn-dark" onClick={() => setShowRegistro(true)}>
                + Registrar venta
              </button>
            </div>

              <div className="d-none d-lg-block">
                <ReusableDataTable
                  data={ventas}
                  columns={columns}
                  loading={loading}
                  error={error}
                  onView={handleView}
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
                      search: "Buscar:",
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
                  data={ventas}
                  loading={loading}
                  error={error}
                  emptyMessage="No se encontraron ventas"
                  renderCard={(item) => {
                    const estadoPedido = item.Estados_pedido?.nombre;
                    const producciones = item.Producciones || [];
                    const produccionTerminada = producciones.length > 0
                      && producciones.every((produccion) => produccion.Estados_produccion?.nombre === "Terminado");
                    const puedeAvanzar = (estadoPedido === "En producción" && produccionTerminada)
                      || estadoPedido === "Listo para entrega";
                    const metodosPago = item.Pagos?.map((pago) => pago.Metodos_pago?.nombre).filter(Boolean);
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
                          <span className="badge bg-secondary">{estadoPedido || "-"}</span>
                        </div>
                        <div className="row small text-muted g-2">
                          <div className="col-12"><strong>Fecha:</strong> {new Date(item.fecha).toLocaleString()}</div>
                          <div className="col-6"><strong>Total:</strong> ${Number(item.total || 0).toLocaleString()}</div>
                          <div className="col-6"><strong>Método de pago:</strong> {metodosPago?.length ? metodosPago.join(" + ") : "-"}</div>
                        </div>
                        <div className="d-flex flex-wrap justify-content-end gap-2 border-top pt-2 mt-3">
                          <button className="btn btn-sm btn-info text-white" onClick={() => handleView(item.id)}>
                            Ver
                          </button>
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

              <SalesModal
                show={showRegistro}
                onClose={() => setShowRegistro(false)}
                onCreated={refetch}
              />

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