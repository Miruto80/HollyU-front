import { useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useGetFetch } from "../../hooks/useGetFetch";
import { useDeleteFetch } from "../../hooks/useDeleteFetch";
import { SERVER_URL } from "../../services/api";
import ProductModal from "../../components/admin/ProductModal";

export default function ProductosTable() {
   const [showModal, setShowModal] = useState(false);
  const { data: productos, loading, error, refetch } = useGetFetch("/productos");
  const handleEdit = (id) => {
    console.log("Editar producto", id);
    setShowModal(true);
  };

  const { remove, DeleteModal } = useDeleteFetch("/productos");

  const handleDelete = async (id) => {
    try {
      await remove(id);
      refetch();
    } catch (err) {
      console.error(err);
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
    { title: "Código", data: "codigo" },
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
      title: "Precio desde",
      data: null,
      render: (data) => {
        const precios = data.Modelos?.flatMap(m =>
          m.Modelo_telas.map(t => Number(t.precio))
        ) ?? [];
        return precios.length ? `$${Math.min(...precios).toLocaleString()}` : "-";
      }
    },
    {
      title: "Estado",
      data: "activo",
      render: (val) =>
        val
          ? '<span class="badge bg-success">Activo</span>'
          : '<span class="badge bg-secondary">Inactivo</span>'
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

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-danger">Error al cargar productos.</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Productos</h3>
        <button className="btn btn-dark" onClick={() => setShowModal(true)}>
          + Registrar producto
        </button>
      </div>

      <ReusableDataTable
        data={productos}
        columns={columns}
        loading={loading}
        error={error}
        options={{
          language: {
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            zeroRecords: "No se encontraron resultados"
          }
        }}
        className="table table-striped table-hover"
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreated={refetch}
      />
      <DeleteModal />
    </div>
  );
}