import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import api from "../../services/api";
import { notifySuccess, notifyError } from "../../utils/Tostify";
import { confirmarAccion, alertaExito, alertaError } from "../../utils/Alert";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import OrderModal from "../../components/admin/OrderModal";

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
        if (estadoPago === "Pendiente de verificación") {
          return '<span class="badge bg-warning text-dark">VERIFICAR PAGO</span>';
        }
        if (estadoPago === "Verificado") {
          return '<span class="badge bg-success">PAGO VERIFICADO</span>';
        }
        if (estadoPago === "Rechazado") {
          return '<span class="badge bg-danger">PAGO RECHAZADO</span>';
        }
        return `<span class="badge bg-secondary">${d.Estados_pedido?.nombre ?? "-"}</span>`;
      }
    },
    {
      title: "Total",
      data: "total_bs",
      render: (val) => `${Number(val).toLocaleString(undefined, { maximumFractionDigits: 2 })} Bs`
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
        const accionesPago = estadoPago === "Pendiente de verificación"
          ? `
        <button class="btn btn-sm btn-success btn-confirmar" data-id="${d.id}" title="Confirmar pago">
          ✓
        </button>
        <button class="btn btn-sm btn-danger btn-rechazar" data-id="${d.id}" title="Rechazar pago">
          ✕
        </button>`
          : "";

        return `
        <button class="btn btn-sm btn-info text-white btn-ver-pedidos" data-id="${d.id}" title="Ver detalle">
          Ver
        </button>
        ${accionesPago}
      `;
      }
    }
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Pedido Web</h3>

      <ReusableDataTable
        data={pedidos}
        columns={columns}
        loading={loading}
        error={error}
        onView={handleView}
        onConfirm={handleConfirm}
        onReject={handleReject}
        options={{
          language: {
            search: "Buscador:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            zeroRecords: "No se encontraron resultados"
          }
        }}
        className="table table-striped table-hover"
      />

      <OrderModal
        pedidoId={pedidoSeleccionadoId}
        show={showDetalle}
        onClose={() => setShowDetalle(false)}
      />
    </div>
  );
}