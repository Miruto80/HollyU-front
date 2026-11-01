import { useState } from "react";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
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


    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
            <h3 className="card-title m-0 fw-bold text-dark"> <FontAwesomeIcon icon={faPalette} style={{ color: "#ffc107" }} /> Color</h3>
           
            <button className="btn btn-dark" onClick={() => setShowForm((visible) => !visible)}>
              {showForm ? "Cancelar" : "+ Registrar color"}
            </button>
          </div>
          
          {/* Formulario*/}
          {showForm && (
            <div className="card ShoFor border-0 mb-5">
              <div className="card-body">

                <div className="card  border-0 ">
                  <div className="card-body">
                    
                    <div className="mb-3">
                      <h5 className="card-title fw-bold text-dark mb-1"> <FontAwesomeIcon icon={faCirclePlus} style={{ color: "#ffc107" }} /> Registrar nuevo color</h5>
                      <p className="text-muted small mb-0">Ingresa el nombre y codigo del color que deseas agregar al sistema.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {saveError && (
                        <div className="alert alert-danger">
                          {saveError.response?.data?.message || "No se pudo registrar la talla."}
                        </div>
                      )}
                      <div className="row g-3 align-items-end">
                          <div className="col-12 col-md-6">
                              <label className="form-label" htmlFor="color-nombre">Nombre</label>
                              <input 
                                  id="color-nombre" 
                                  className="form-control" 
                                  value={nombre} 
                                  onChange={(event) => setNombre(event.target.value)} 
                                  required 
                              />
                          </div>

                          <div className="col-6 col-md-3">
                              <label className="form-label" htmlFor="color-hex">Código HEX</label>
                              <input 
                                  id="color-hex" 
                                  type="color" 
                                  className="form-control form-control-color w-50" 
                                  value={codigoHex} 
                                  onChange={(event) => setCodigoHex(event.target.value)} 
                                  title="Seleccionar color" 
                              />
                          </div>
                          
                          <div className="col-6 col-md-3">
                              <button className="btn btn-primary w-100" type="submit" disabled={saving}>
                                  {saving ? "Guardando..." : "Guardar"}
                              </button>
                          </div>
                      </div>
                    </form>
                  </div>
                </div>

             </div>
            </div>
          )}

      <ReusableDataTable
        data={colores}
        columns={columns}
        loading={loading}
        error={error}
        options={{
          columnDefs: [
            { targets: 0, className: "text-center" }, 
            { targets: 1, className: "text-start" },  
            { targets: 2, className: "text-start" },
            { targets: 3, className: "text-start" }
          
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
      />
      

        </div>
      </div>
    </div>
  );
}
