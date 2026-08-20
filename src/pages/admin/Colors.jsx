import { useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";

export default function Colors() {
  const { data: colores = [], loading, error, refetch } = useGetFetch("/colores");
  const { post, loading: saving, error: saveError } = usePostFetch("/colores");
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [codigoHex, setCodigoHex] = useState("#000000");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await post({ nombre: nombre.trim(), codigo_hex: codigoHex });
      setNombre("");
      setCodigoHex("#000000");
      setShowForm(false);
      refetch();
    } catch {
      // El error se muestra debajo del formulario.
    }
  };

  const columns = [
    { title: "ID", data: "id" },
    { title: "Nombre", data: "nombre" },
    {
      title: "Color",
      data: "codigo_hex",
      render: (value) => value
        ? `<span class="d-inline-block rounded-circle border" style="width:24px;height:24px;background-color:${value}" title="${value}"></span>`
        : "-"
    },
    { title: "Código HEX", data: "codigo_hex", defaultContent: "-" }
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Colores</h3>
        <button className="btn btn-dark" onClick={() => setShowForm((visible) => !visible)}>
          {showForm ? "Cancelar" : "+ Registrar color"}
        </button>
      </div>

      {showForm && (
        <form className="card card-body mb-4" onSubmit={handleSubmit}>
          {saveError && (
            <div className="alert alert-danger">
              {saveError.response?.data?.message || "No se pudo registrar el color."}
            </div>
          )}
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label" htmlFor="color-nombre">Nombre</label>
              <input id="color-nombre" className="form-control" value={nombre} onChange={(event) => setNombre(event.target.value)} required />
            </div>
            <div className="col-md-3">
              <label className="form-label" htmlFor="color-hex">Código HEX</label>
              <input id="color-hex" type="color" className="form-control form-control-color" value={codigoHex} onChange={(event) => setCodigoHex(event.target.value)} title="Seleccionar color" />
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
        data={colores}
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
