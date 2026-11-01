import { useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useGetFetch } from "../../hooks/useGetFetch";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUsers,

} from "@fortawesome/free-solid-svg-icons";
export default function Clients() {
  const { data: clientes = [], loading, error } = useGetFetch("/clientes");
  const [selectedClient, setSelectedClient] = useState(null);
  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenPedidos = async (cliente) => {
    setSelectedClient(cliente);
    setModalOpen(true);
    setLoadingPedidos(true);

    try {
      const response = await api.get(`/clientes/${cliente.id}/pedidos`);
      setPedidosCliente(response.data || []);
    } catch (err) {
      console.error(err);
      setPedidosCliente([]);
    } finally {
      setLoadingPedidos(false);
    }
  };

  const handleView = async (id) => {
    const cliente = clientes.find((item) => String(item.id) === String(id));
    if (!cliente) return;

    await handleOpenPedidos(cliente);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedClient(null);
    setPedidosCliente([]);
  };

  const columns = [
    {
      title: "Nombre",
      data: null,
      render: (data) => `${data.nombres || ""} ${data.apellidos || ""}`.trim() || "-"
    },
    { title: "Documento", data: "documento", render: (val) => val || "-" },
    { title: "Email", data: "email", render: (val) => val || "-" },
    { title: "Teléfono", data: "telefono", render: (val) => val || "-" },
    { title: "Ciudad", data: "ciudad", render: (val) => val || "-" },
    {
      title: "Estado",
      data: null,
      render: (data) =>
        data.activo
          ? '<span class="badge bg-success">Activo</span>'
          : '<span class="badge bg-secondary">Inactivo</span>'
    },
    {
      title: "Acciones",
      data: "id",
      orderable: false,
      render: (id) => `
        <button class="btn btn-sm btn-outline-primary btn-ver-pedidos" data-id="${id}">Ver más</button>
      `
    }
  ];

  return (
    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
              <h3 className="card-title m-0 fw-bold text-dark"> <FontAwesomeIcon icon={faUsers} style={{ color: "#ffc107" }} /> Clientes</h3>
          </div>

      <ReusableDataTable
        data={clientes}
        columns={columns}
        loading={loading}
        error={error}
        options={{
          columnDefs: [
                { targets: 0, className: "text-start" }, 
                { targets: 1, className: "text-start" },  
                { targets: 2, className: "text-start" },  
                { targets: 3, className: "text-start" },  
                { targets: 4, className: "text-start" },  
                { targets: 5, className: "text-center" },  
                { targets: 6, className: "text-center" },  
                
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
        onView={handleView}
      />

      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Pedidos de {selectedClient ? `${selectedClient.nombres} ${selectedClient.apellidos}` : "cliente"}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
                {loadingPedidos ? (
                  <p>Cargando pedidos...</p>
                ) : pedidosCliente.length === 0 ? (
                  <p className="text-muted mb-0">Este cliente no tiene pedidos registrados.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Fecha</th>
                          <th>Subtotal</th>
                          <th>Descuento</th>
                          <th>Total</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidosCliente.map((pedido) => (
                          <tr key={pedido.id}>
                            <td>{pedido.id}</td>
                            <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                            <td>${Number(pedido.subtotal || 0).toLocaleString()}</td>
                            <td>${Number(pedido.descuento || 0).toLocaleString()}</td>
                            <td>${Number(pedido.total || 0).toLocaleString()}</td>
                            <td>
                              <span className="badge bg-info text-dark">
                                {pedido.Estados_pedido?.nombre || "Sin estado"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      </div>
        </div>
  );
}
