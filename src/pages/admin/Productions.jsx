import { useGetFetch } from "../../hooks/useGetFetch";
import api from "../../services/api";
import { notifySuccess, notifyError } from "../../utils/Tostify";
import { confirmarAccion } from "../../utils/Alert";
import ReusableDataTable from "../../components/common/ReusableDataTable";

export default function Productions() {
  const { data: producciones, loading, error, refetch } = useGetFetch("/producciones");

  const handleAvanzar = async (id) => {
    const ok = await confirmarAccion({
      titulo: "¿Avanzar a la siguiente etapa?",
      texto: "Esta producción pasará al siguiente estado",
      icon: "question"
    });
    if (!ok) return;

    try {
      await api.patch(`/producciones/${id}/avanzar`);
      notifySuccess("Producción avanzada");
      refetch();
    } catch (err) {
      notifyError(err.response?.data?.message || "No se pudo avanzar la producción");
    }
  };

  const columns = [
    { title: "ID", data: "id" },
    {
      title: "Pedido",
      data: null,
      render: (d) => `#${d.Pedido?.id ?? "-"}`
    },
    {
      title: "Cliente",
      data: null,
      render: (d) => d.Pedido?.Cliente
        ? `${d.Pedido.Cliente.nombres} ${d.Pedido.Cliente.apellidos ?? ""}`
        : "-"
    },
    {
      title: "Etapa actual",
      data: null,
      render: (d) => {
        const nombre = d.Estados_produccion?.nombre ?? "-";
        return `<span class="badge bg-info text-dark">${nombre}</span>`;
      }
    },
    {
      title: "Inicio",
      data: "fecha_inicio",
      render: (f) => f ? new Date(f).toLocaleDateString() : "-"
    },
    {
      title: "Entrega estimada",
      data: null,
      render: (d) => d.Pedido?.fecha_entrega_estimada
        ? new Date(d.Pedido.fecha_entrega_estimada).toLocaleDateString()
        : "-"
    },
    {
      title: "Finalizado",
      data: "fecha_final",
      render: (f) => f ? new Date(f).toLocaleDateString() : "-"
    },
    {
      title: "Acción",
      data: "id",
      orderable: false,
      render: (id) => `
        <button class="btn btn-sm btn-primary btn-avanzar" data-id="${id}">
          Avanzar →
        </button>
      `
    }
  ];

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Producción</h3>

      <ReusableDataTable
        data={producciones}
        columns={columns}
        loading={loading}
        error={error}
        onAvanzar={handleAvanzar}
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
    </div>
  );
}