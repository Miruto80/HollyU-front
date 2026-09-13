import { useGetFetch } from "../../hooks/useGetFetch";

export default function ProductDetailsModal({ productId, onClose }) {
  const { data: producto, loading, error } = useGetFetch(
    productId ? `/productos/${productId}` : null,
    [productId]
  );

  if (!productId) return null;

  const modelos = producto?.Modelos ?? [];
  const precioMayor = Number(producto?.precio_mayor || 0).toLocaleString();

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Detalle del producto</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
          </div>

          <div className="modal-body">
            {loading && <p className="text-center mb-0">Cargando detalles...</p>}
            {error && <div className="alert alert-danger mb-0">No se pudieron cargar los detalles del producto.</div>}

            {!loading && !error && producto && (
              <>
                <div className="mb-4">
                  <h6>Descripción</h6>
                  <p className="text-muted mb-3">{producto.descripcion || "Sin descripción"}</p>
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Tipos de bota</dt>
                    <dd className="col-sm-8">{producto.Tipos_bota?.map((tipo) => tipo.nombre).join(", ") || "-"}</dd>
                    <dt className="col-sm-4">Fabricación</dt>
                    <dd className="col-sm-8">{producto.tiempo_fabricacion ?? "-"} días</dd>
                    <dt className="col-sm-4">Precio al mayor</dt>
                    <dd className="col-sm-8">${precioMayor}</dd>
                    <dt className="col-sm-4">Personalización</dt>
                    
                    <dd className="col-sm-8">{producto.permite_personalizacion ? "Sí" : "No"}</dd>
                  </dl>
                </div>

                <hr className="my-4" />
                <h5>Modelos</h5>
                {modelos.length === 0 ? (
                  <p className="text-muted">Este producto no tiene modelos registrados.</p>
                ) : (
                  <div className="row g-3">
                    {modelos.map((modelo) => (
                      <div className="col-md-6" key={modelo.id}>
                        <div className="border rounded p-3 h-100">
                          <h6>{modelo.nombre}</h6>
                          <p className="small text-muted">{modelo.descripcion || "Sin descripción"}</p>
                          {modelo.Modelo_telas?.map((tela) => (
                            <div key={tela.id} className="small mb-2">
                              <strong>Tela:</strong> {tela.Tipos_tela?.nombre || "-"}<br />
                              <strong>Colores:</strong> {tela.Modelo_telas_colores?.map((item) => item.color?.nombre).filter(Boolean).join(", ") || "-"}
                            </div>
                          ))}
                          <div className="small">
                            <strong>Tallas:</strong> {modelo.Modelo_tallas?.map((item) => item.Talla?.nombre).filter(Boolean).join(", ") || "-"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
