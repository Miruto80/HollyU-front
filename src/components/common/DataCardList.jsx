import { useId, useMemo, useState } from "react";

const PAGE_SIZE = 10;
const EMPTY_DATA = [];

const normalizeSearchText = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const getSearchableText = (value) => {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.map(getSearchableText).join(" ");
  if (typeof value === "object") return Object.values(value).map(getSearchableText).join(" ");
  return String(value);
};

export default function DataCardList({ 
  data, 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  renderCard, 
  emptyMessage = "No se encontraron resultados" 
}) {
  const searchInputId = useId();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const records = Array.isArray(data) ? data : EMPTY_DATA;
  const normalizedSearchTerm = normalizeSearchText(searchTerm.trim());

  const filteredData = useMemo(() => {
    if (!normalizedSearchTerm) return records;

    return records.filter((item) =>
      normalizeSearchText(getSearchableText(item)).includes(normalizedSearchTerm)
    );
  }, [records, normalizedSearchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const visiblePage = Math.min(currentPage, pageCount);
  const pageData = useMemo(() => {
    const startIndex = (visiblePage - 1) * PAGE_SIZE;
    return filteredData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredData, visiblePage]);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 my-4">
        <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted fw-medium mb-0">Cargando registros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        {error?.message || (typeof error === "string" ? error : "Error al cargar los datos.")}
      </div>
    );
  }

  if (records.length === 0) {
    return <div className="text-center py-4 text-muted">{emptyMessage}</div>;
  }

  return (
    <>
      <div className="mb-3">
        <label className="visually-hidden" htmlFor={searchInputId}>Buscar registros</label>
        <input
          id={searchInputId}
          type="search"
          className="form-control"
          placeholder="Buscardor..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-4 text-muted" role="status">
          No se encontraron registros que coincidan con la búsqueda.
        </div>
      ) : (
        <>
          <div className="row g-3">
            {pageData.map((item) => {
              const id = item.id;
              return (
                <div className="col-12" key={id}>
                  <div className="card border shadow-sm p-3">
                    <div className="mb-3">
                      {renderCard ? renderCard(item) : (
                        <div>
                          <h5 className="mb-1 fw-bold text-dark">
                            {item.nombre || item.title || `Registro #${id}`}
                          </h5>
                        </div>
                      )}
                    </div>

                    {(onEdit || onDelete) && (
                      <div className="d-flex justify-content-end gap-2 border-top pt-2">
                        {onEdit && (
                          <button
                            className="btn btn-sm btn-outline-primary px-3"
                            onClick={() => onEdit(id)}
                          >
                            Editar
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="btn btn-sm btn-outline-danger px-3"
                            onClick={() => onDelete(id)}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <nav
            className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mt-3"
            aria-label="Paginación de registros"
          >
            <span className="small text-muted">
              Mostrando {(visiblePage - 1) * PAGE_SIZE + 1} a{" "}
              {Math.min(visiblePage * PAGE_SIZE, filteredData.length)} de {filteredData.length}
            </span>
            {pageCount > 1 && (
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCurrentPage(visiblePage - 1)}
                  disabled={visiblePage === 1}
                >
                  Anterior
                </button>
                <span className="small text-muted" aria-live="polite">
                  Página {visiblePage} de {pageCount}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setCurrentPage(visiblePage + 1)}
                  disabled={visiblePage === pageCount}
                >
                  Siguiente
                </button>
              </div>
            )}
          </nav>
        </>
      )}
    </>
  );
}