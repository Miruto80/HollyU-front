import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReusableDataTable from "../../components/common/ReusableDataTable";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import {
  faRulerCombined,
  faCirclePlus,
  faSearch,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

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
    <div className="container-fluid px-2 px-md-4 px-lg-4 py-2">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-5">
            <h3 className="card-title m-0 fw-bold text-dark"> <FontAwesomeIcon icon={faRulerCombined} style={{ color: "#ffc107" }} /> Tallas</h3>
            <button 
              className="btn btn-dark" 
              onClick={() => setShowForm((visible) => !visible)}
            >
              {showForm ? "Cancelar" : "+ Registrar talla"}
            </button>
          </div>
          
          {/* Formulario*/}
          {showForm && (
            <div className="card ShoFor border-0 mb-5">
              <div className="card-body">

                <div className="card  border-0 ">
                  <div className="card-body">
                    
                    <div className="mb-3">
                      <h5 className="card-title fw-bold text-dark mb-1"> <FontAwesomeIcon icon={faCirclePlus} style={{ color: "#ffc107" }} /> Registrar nueva talla</h5>
                      <p className="text-muted small mb-0">Ingresa el nombre de la talla que deseas agregar al sistema.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {saveError && (
                        <div className="alert alert-danger">
                          {saveError.response?.data?.message || "No se pudo registrar la talla."}
                        </div>
                      )}
                      <div className="row g-3 align-items-end">
                        <div className="col-12 col-md-9">
                          <label className="form-label" htmlFor="talla-nombre">Nombre</label>
                          <input 
                            id="talla-nombre" 
                            className="form-control" 
                            value={nombre} 
                            onChange={(event) => setNombre(event.target.value)} 
                            required 
                          />
                        </div>
                        <div className="col-12 col-md-3">
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

          {/*Tabla */}
          <div className="table-responsive">
            <ReusableDataTable
              data={tallas}
              columns={columns}
              loading={loading}
              error={error}
              options={{
                columnDefs: [
                  { targets: 0, className: "text-center" }, 
                  { targets: 1, className: "text-start" },  
                  
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
    </div>
  );
}
