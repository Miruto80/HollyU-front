import { useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import DataCardList from "../../components/common/DataCardList";
import { useGetFetch } from "../../hooks/useGetFetch";
import { useDeleteFetch } from "../../hooks/useDeleteFetch";
import { usePutFetch } from "../../hooks/usePutFetch";
import { notifySuccess, notifyError } from "../../utils/Tostify";
import { SERVER_URL } from "../../services/api";
import ProductModal from "../../components/admin/ProductModal";
import ProductDetailsModal from "../../components/admin/ProductDetailsModal";
import { icon } from "@fortawesome/fontawesome-svg-core";
import { faEye, faPenToSquare, faTrash, faWarning, faBox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProductosTable() {
  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [detailProductId, setDetailProductId] = useState(null);
  const { data: productos, loading, error, refetch } = useGetFetch("/productos");
  
  const handleEdit = (id) => {
    setProductId(id);
    setShowModal(true);
  };

  const handleCreate = () => {
    setProductId(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductId(null);
  };

  const handleView = (id) => setDetailProductId(id);

  const { remove, DeleteModal } = useDeleteFetch("/productos");
  const { put: putEstatus } = usePutFetch("/productos");

  const handleDelete = async (id) => {
    try {
      await remove(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleEstatus = async (id, estatusActual) => {
    const nuevoEstatus = Number(estatusActual) === 1 ? 2 : 1;
    try {
      await putEstatus(`${id}/estatus`, { estatus: nuevoEstatus });
      notifySuccess("Estado actualizado");
      refetch();
    } catch {
      notifyError("No se pudo actualizar el estado");
    }
  };

  const columns = [
    {
      title: "Imagen",
      data: null,
      orderable: false,
      render: (data) => {
        const img = data.Producto_imagenes?.[0]?.imagen;
        const src = img ? `${SERVER_URL}${img}` : "/images/no-image.jpg";
        return `<img src="${src}" style="width:50px;height:50px;object-fit:cover;border-radius:6px;" />`;
      }
    },
    { title: "Nombre", data: "nombre" },
    {
      title: "Categoría",
      data: null,
      render: (data) => data.Categoria?.nombre ?? "-"
    },
    {
      title: "Género",
      data: null,
      render: (data) => data.Genero?.nombre ?? "-"
    },
    {
      title: "Precio",
      data: null,
      render: (data) => `$${Number(data.precio).toLocaleString()}`
    },
    { title: "Stock", data: "stock" },
    {
      title: "Estado",
      data: "estatus",
      render: (val) => {
        if (val === 1) return '<span class="badge bg-success">Activo</span>';
        if (val === 2) return '<span class="badge bg-secondary">Desactivado</span>';
        return '<span class="badge bg-dark">Eliminado</span>';
      }
    },
    {
      title: "Acciones",
      data: "id",
      orderable: false,
      render: (id, type, row) => `
        <button class="btn btn-sm btn-outline-info btn-ver-producto" data-id="${id}" title="Ver más">
          ${icon(faEye).html.join("")}
        </button>
        <button class="btn btn-sm btn-outline-primary btn-editar" data-id="${id}" title="Editar">
          ${icon(faPenToSquare).html.join("")}
        </button>
        <button class="btn btn-sm btn-outline-${row.estatus === 1 ? 'secondary' : 'success'} btn-toggle-estatus" data-id="${id}" data-estatus="${row.estatus}">
          ${icon(faWarning).html.join("")}
        </button>
        <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${id}" title="Eliminar">
          ${icon(faTrash).html.join("")}
        </button>
      `
    }
  ];

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 my-4">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted fw-medium">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger border-0 shadow-sm rounded-4 p-4 my-3 text-center" role="alert">
        <h5 className="alert-heading fw-bold mb-1">¡algo salió mal!</h5>
        <p className="mb-0 text-muted small">
          {error?.message || "Error al cargar productos."}
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
            <h3 className="card-title m-0 fw-bold text-dark"> 
              <FontAwesomeIcon icon={faBox} style={{ color: "#ffc107" }} /> Productos
            </h3>
            
            <button className="btn btn-dark" onClick={handleCreate}>
              + Registrar producto
            </button>
          </div>

          {/* Vista para Laptops y PC (>= 992px) */}
          <div className="d-none d-lg-block">
            <ReusableDataTable
              data={productos}
              columns={columns}
              loading={loading}
              error={error}
              options={{
                columnDefs: [
                  { targets: 0, className: "text-center" }, 
                  { targets: 1, className: "text-start" },  
                  { targets: 2, className: "text-center" },  
                  { targets: 3, className: "text-center" },  
                  { targets: 4, className: "text-center" },  
                  { targets: 5, className: "text-center" },  
                  { targets: 6, className: "text-center" },  
                  { targets: 7, className: "text-center" },  
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
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
              onToggleEstatus={handleToggleEstatus}
            />
          </div>

          {/* Vista para Teléfonos y Tablets (< 992px) usando DataCardList */}
          <div className="d-block d-lg-none">
            <DataCardList
              data={productos}
              loading={loading}
              error={error}
              emptyMessage="No se encontraron resultados"
              // Usamos las funciones de acción directamente en los botones de la tarjeta móvil
              onEdit={handleEdit}
              onDelete={handleDelete}
              renderCard={(item) => {
                const img = item.Producto_imagenes?.[0]?.imagen;
                const src = img ? `${SERVER_URL}${img}` : "/images/no-image.jpg";
                
                const badgeStatus = 
                  item.estatus === 1 ? <span className="badge bg-success">Activo</span> :
                  item.estatus === 2 ? <span className="badge bg-secondary">Desactivado</span> :
                  <span className="badge bg-dark">Eliminado</span>;

                return (
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img 
                        src={src} 
                        alt={item.nombre} 
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }} 
                      />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <span className="badge bg-light text-dark border">ID: {item.id}</span>
                          {badgeStatus}
                        </div>
                        <h5 className="mb-0 fw-bold text-dark mt-1">{item.nombre}</h5>
                      </div>
                    </div>

                    <div className="row small text-muted g-2 mb-3">
                      <div className="col-6">
                        <strong>Categoría:</strong> {item.Categoria?.nombre ?? "-"}
                      </div>
                      <div className="col-6">
                        <strong>Género:</strong> {item.Genero?.nombre ?? "-"}
                      </div>
                      <div className="col-6">
                        <strong>Precio:</strong> <span className="text-dark fw-bold">${Number(item.precio).toLocaleString()}</span>
                      </div>
                      <div className="col-6">
                        <strong>Stock:</strong> {item.stock}
                      </div>
                    </div>

                    {/* Acciones adicionales para móvil; Editar y Eliminar las provee DataCardList. */}
                    <div className="d-flex justify-content-end gap-2 border-top pt-2">
                      <button 
                        className="btn btn-sm btn-outline-info" 
                        title="Ver más"
                        onClick={() => handleView(item.id)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        className={`btn btn-sm btn-outline-${item.estatus === 1 ? 'secondary' : 'success'}`}
                        title="Cambiar estado"
                        onClick={() => handleToggleEstatus(item.id, item.estatus)}
                      >
                        <FontAwesomeIcon icon={faWarning} />
                      </button>
                    </div>
                  </div>
                );
              }}
            />
          </div>

          <ProductModal
            show={showModal}
            productId={productId}
            onClose={handleCloseModal}
            onCreated={refetch}
            onUpdated={refetch}
          />
          <ProductDetailsModal
            productId={detailProductId}
            onClose={() => setDetailProductId(null)}
          />
          <DeleteModal />
        </div>
      </div>
    </div>
  );
}