import { useGetFetch } from "../../hooks/useGetFetch";
import api from "../../services/api";
import { notifySuccess, notifyError } from "../../utils/Tostify";
import { confirmarAccion } from "../../utils/Alert";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import DataCardList from "../../components/common/DataCardList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";


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
      data: null,
      orderable: false,
      render: (_, __, d) => d.Estados_produccion?.nombre === "Terminado" ? "" : `
        <button class="btn btn-sm btn-primary btn-avanzar" data-id="${d.id}">
          Avanzar →
        </button>
      `
    }
  ];

  return (
    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
              <h3 className="card-title m-0 fw-bold text-dark"> <FontAwesomeIcon icon={faMoneyBillWave} style={{ color: "#ffc107" }} /> Producciones</h3>
            </div>

            {/* Vista para Laptops y PC (>= 992px) */}
            <div className="d-none d-lg-block">
              <ReusableDataTable
                data={producciones}
                columns={columns}
                loading={loading}
                error={error}
                onAvanzar={handleAvanzar}
                options={{
                  columnDefs: [
                    { targets: 0, className: "text-center" }, 
                    { targets: 1, className: "text-center" },  
                    { targets: 2, className: "text-start" },  
                    { targets: 3, className: "text-center" },  
                    { targets: 4, className: "text-center" },  
                    { targets: 5, className: "text-center" },  
                    { targets: 6, className: "text-start" },  
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

            {/* Vista para Teléfonos y Tablets (< 992px) con DataCardList */}
            <div className="d-block d-lg-none">
              <DataCardList
                data={producciones}
                loading={loading}
                error={error}
                emptyMessage="No se encontraron resultados"
                renderCard={(item) => {
                  const etapaNombre = item.Estados_produccion?.nombre ?? "-";
                  const clienteNombre = item.Pedido?.Cliente 
                    ? `${item.Pedido.Cliente.nombres} ${item.Pedido.Cliente.apellidos ?? ""}` 
                    : "-";
                  const inicio = item.fecha_inicio ? new Date(item.fecha_inicio).toLocaleDateString() : "-";
                  const entrega = item.Pedido?.fecha_entrega_estimada 
                    ? new Date(item.Pedido.fecha_entrega_estimada).toLocaleDateString() 
                    : "-";
                  const final = item.fecha_final ? new Date(item.fecha_final).toLocaleDateString() : "-";
                  const isTerminado = etapaNombre === "Terminado";

                  return (
                    <>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge bg-light text-dark border me-2">ID: {item.id}</span>
                          <h5 className="mb-1 fw-bold text-dark d-inline-block">Pedido #{item.Pedido?.id ?? "-"}</h5>
                        </div>
                        <div>
                          <span className="badge bg-info text-dark">{etapaNombre}</span>
                        </div>
                      </div>

                      <div className="row small text-muted g-2 mb-3">
                        <div className="col-12">
                          <strong>Cliente:</strong> {clienteNombre}
                        </div>
                        <div className="col-6">
                          <strong>Inicio:</strong> {inicio}
                        </div>
                        <div className="col-6">
                          <strong>Entrega estimada:</strong> {entrega}
                        </div>
                        <div className="col-6">
                          <strong>Finalizado:</strong> {final}
                        </div>
                      </div>

                      {!isTerminado && (
                        <div className="d-flex justify-content-end border-top pt-2">
                          <button
                            className="btn btn-sm btn-primary px-3"
                            onClick={() => handleAvanzar(item.id)}
                          >
                            Avanzar →
                          </button>
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </div>

        </div>
      </div>
    </div>
  );
}