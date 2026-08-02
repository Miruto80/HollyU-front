import { useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useGetFetch } from "../../hooks/useGetFetch";
import { useDeleteFetch } from "../../hooks/useDeleteFetch";
import CategoryModal from "../../components/admin/CategoryModal";
export default function Categories() {
  const { data: categorias, loading, error, refetch } = useGetFetch("/categorias");

  const { remove, DeleteModal } = useDeleteFetch("/categorias");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleCreate = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    const cat = categorias?.find((c) => String(c.id) === String(id));
    if (!cat) return alert("Categoría no encontrada");
    setEditing(cat);
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
    { title: "Descripción", data: "descripcion" },
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Categorías</h3>
        <button className="btn btn-dark" onClick={handleCreate}>
          + Registrar categoría
        </button>
      </div>

      <ReusableDataTable
        data={categorias}
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
      <CategoryModal show={showModal} onClose={() => setShowModal(false)} onSaved={refetch} category={editing} />
      <DeleteModal />
    </div>
  );
}

