import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import SalesModal from "../../components/admin/SalesModal";
import OrderModal from "../../components/admin/OrderModal";

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
      data: "id",
      orderable: false,
      render: (id) => `
        <button class="btn btn-sm btn-info text-white btn-ver-pedidos" data-id="${id}">
          Ver
        </button>
      `
    }
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Ventas Presenciales</h3>
        <button className="btn btn-dark" onClick={() => setShowRegistro(true)}>
          + Registrar venta
        </button>
      </div>

      <ReusableDataTable
        data={ventas}
        columns={columns}
        loading={loading}
        error={error}
        onView={handleView}
        options={{
          language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            zeroRecords: "No se encontraron resultados"
          }
        }}
        className="table table-striped table-hover"
      />

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
  );
}