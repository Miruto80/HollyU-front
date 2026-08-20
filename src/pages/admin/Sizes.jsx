import { useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";

export default function Sizes() {
  const { data: tallas = [], loading, error, refetch } = useGetFetch("/tallas");
  const { post, loading: saving, error: saveError } = usePostFetch("/tallas");
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await post({ nombre: nombre.trim() });
      setNombre("");
      setShowForm(false);
      refetch();
    } catch {
      // El error se muestra debajo del formulario.
    }
  };

  const columns = [
    { title: "ID", data: "id" },
    { title: "Nombre", data: "nombre" }
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Tallas</h3>
        <button className="btn btn-dark" onClick={() => setShowForm((visible) => !visible)}>
          {showForm ? "Cancelar" : "+ Registrar talla"}
        </button>
      </div>

      {showForm && (
        <form className="card card-body mb-4" onSubmit={handleSubmit}>
          {saveError && (
            <div className="alert alert-danger">
              {saveError.response?.data?.message || "No se pudo registrar la talla."}
            </div>
          )}
          <div className="row g-3 align-items-end">
            <div className="col-md-9">
              <label className="form-label" htmlFor="talla-nombre">Nombre</label>
              <input id="talla-nombre" className="form-control" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
            </div>
            <div className="col-md-3">
              <button className="btn btn-primary w-100" type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </form>
      )}

      <ReusableDataTable
        data={tallas}
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
      />
    </div>
  );
}
