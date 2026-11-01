import { useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import DiscountModal from "../../components/admin/DiscountModal";
import { useGetFetch } from "../../hooks/useGetFetch";
import { useDeleteFetch } from "../../hooks/useDeleteFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTags,

} from "@fortawesome/free-solid-svg-icons";

export default function Discounts() {
  const { data: descuentos = [], loading, error, refetch } = useGetFetch("/descuentos");
  const { remove, DeleteModal } = useDeleteFetch("/descuentos");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const descuento = descuentos.find((item) => String(item.id) === String(id));
    if (!descuento) return;
    setEditing(descuento);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { title: "ID", data: "id" },
    { title: "Nombre", data: "nombre" },
    {
      title: "Tipo",
      data: null,
      render: (row) => row.Tipos_descuento?.nombre ?? "-"
    },
    {
      title: "Categoría",
      data: null,
      render: (row) => row.Categoria?.nombre ?? "Sin categoría"
    },
    {
      title: "Valor",
      data: null,
      render: (row) => {
        const tipo = row.Tipos_descuento?.nombre || "";
        return tipo.toLowerCase().includes("porcentaje")
          ? `${Number(row.valor).toFixed(2)}%`
          : `$${Number(row.valor).toLocaleString()}`;
      }
    },
    {
      title: "Vigencia",
      data: null,
      render: (row) => {
        const inicio = row.fecha_inicio ? new Date(row.fecha_inicio).toLocaleDateString() : "-";
        const fin = row.fecha_fin ? new Date(row.fecha_fin).toLocaleDateString() : "-";
        return `${inicio} - ${fin}`;
      }
    },
    {
      title: "Estado",
      data: "activo",
      render: (val) =>
        val ? '<span class="badge bg-success">Activo</span>' : '<span class="badge bg-secondary">Inactivo</span>'
    },
    {
      title: "Acciones",
      data: "id",
      orderable: false,
      render: (id) => `
        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${id}">Editar</button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${id}">Eliminar</button>
      `
    }
  ];

  return (
    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
              <h3 className="card-title m-0 fw-bold text-dark"> <FontAwesomeIcon icon={faTags} style={{ color: "#ffc107" }} /> Descuentos</h3>

               <button className="btn btn-dark" onClick={handleCreate}>+ Crear descuento</button>
            </div>

              <ReusableDataTable
                data={descuentos}
                columns={columns}
                loading={loading}
                error={error}
                options={{
                  columnDefs: [
                    { targets: 0, className: "text-center" }, 
                    { targets: 1, className: "text-start" },  
                    { targets: 2, className: "text-start" },  
                    { targets: 3, className: "text-start" },  
                    { targets: 4, className: "text-start" },  
                    { targets: 5, className: "text-start" },  
                    { targets: 6, className: "text-start" },  
                    { targets: 7, className: "text-start" },  
                    
                  ],                  
                  language: {
                    search: "Buscar:",
                    lengthMenu: "Mostrar _MENU_ registros",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    zeroRecords: "No se encontraron descuentos",
                    paginate: {
                      previous: "Anterior",           
                      next: "Siguiente"               
                    }                    
                  }
                }}
                className="table table-striped table-hover mb-0 custom-table"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <DiscountModal show={showModal} onClose={() => setShowModal(false)} onSaved={refetch} descuento={editing} />
              <DeleteModal />

          </div>
        </div>
    </div>
  );
}
