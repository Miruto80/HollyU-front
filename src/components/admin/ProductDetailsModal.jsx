import { useGetFetch } from "../../hooks/useGetFetch";
import { SERVER_URL } from "../../services/api";

const formatPrice = (value) => `$${Number(value || 0).toLocaleString()}`;

export default function ProductDetailsModal({ productId, onClose }) {
  const { data: producto, loading, error } = useGetFetch(
    productId ? `/productos/${productId}` : null,
    [productId]
  );

  if (!productId) return null;

  const imagenes = producto?.Producto_imagenes ?? [];
  const modelos = producto?.Modelos ?? [];

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
                <div className="row g-4">
                  <div className="col-md-5">
                    {imagenes.length > 0 ? (
                      <div className="row g-2">
                        {imagenes.map((imagen) => (
                          <div className="col-6" key={imagen.id}>
                            <img
                              src={`${SERVER_URL}${imagen.imagen}`}
                              alt={producto.nombre}
                              className="img-fluid rounded border w-100"
                              style={{ height: 170, objectFit: "cover" }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border rounded text-center text-muted p-5">Sin imágenes</div>
                    )}
                  </div>

                  <div className="col-md-7">
                    <h4>{producto.nombre}</h4>
                    <p className="text-muted">{producto.descripcion || "Sin descripción"}</p>
                    <dl className="row mb-0">
                      <dt className="col-sm-5">Categoría</dt>
                      <dd className="col-sm-7">{producto.Categoria?.nombre || "-"}</dd>
                      <dt className="col-sm-5">Género</dt>
                      <dd className="col-sm-7">{producto.Genero?.nombre || "-"}</dd>
                      <dt className="col-sm-5">Tipos de bota</dt>
                      <dd className="col-sm-7">{producto.Tipos_bota?.map((tipo) => tipo.nombre).join(", ") || "-"}</dd>
                      <dt className="col-sm-5">Precio base</dt>
                      <dd className="col-sm-7">{formatPrice(producto.precio)}</dd>
                      <dt className="col-sm-5">Precio mayorista</dt>
                      <dd className="col-sm-7">{formatPrice(producto.precio_mayor)}</dd>
                      <dt className="col-sm-5">Stock</dt>
                      <dd className="col-sm-7">{producto.stock ?? 0}</dd>
                      <dt className="col-sm-5">Fabricación</dt>
                      <dd className="col-sm-7">{producto.tiempo_fabricacion ?? "-"} días</dd>
                      <dt className="col-sm-5">Personalización</dt>
                      <dd className="col-sm-7">{producto.permite_personalizacion ? "Sí" : "No"}</dd>
                    </dl>
                  </div>
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
