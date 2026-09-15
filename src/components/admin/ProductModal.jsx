import { useState, useEffect } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import { usePutFetch } from "../../hooks/usePutFetch";
import api, { SERVER_URL } from "../../services/api";
import { notifySuccess, notifyError } from "../../utils/Tostify";
import { confirmarAccion } from "../../utils/Alert";
import ImageUploaderMultiple from "../ImageUploaderMultiple";

const FORM_INICIAL = {
  nombre: "",
  descripcion: "",
  categoria_id: "",
  genero_id: "",
  tipo_bota_ids: [],
  precio: "",
  precio_mayor: "",
  stock: 0,
  permite_personalizacion: true,
  tiempo_fabricacion: 7
};

const MODELO_INICIAL = {
  nombre: "",
  descripcion: "",
  tipo_tela_id: "",
  precio: "",
  precio_mayor: "",
  colores: [],
  tallas: []
};

export default function ProductoModal({ show, productId, onClose, onCreated, onUpdated }) {
  const esEdicion = Boolean(productId);

  const { data: categorias } = useGetFetch("/categorias");
  const { data: generos } = useGetFetch("/generos");
  const { data: tiposTela } = useGetFetch("/tipos_tela");
  const { data: tiposBota } = useGetFetch("/tipo_bota");
  const { data: colores } = useGetFetch("/colores");
  const { data: tallas } = useGetFetch("/tallas");

  const { data: productoExistente, loading: cargandoProducto, refetch: refetchProducto } = useGetFetch(
    show && productId ? `/productos/${productId}` : null,
    [productId, show]
  );

  const { post, loading: guardando, error: errorPost } = usePostFetch("/productos");
  const { put, loading: actualizando, error: errorPut } = usePutFetch("/productos");

  const [form, setForm] = useState(FORM_INICIAL);
  const [modelo, setModelo] = useState(MODELO_INICIAL);
  const [imagenes, setImagenes] = useState([]);
  const [editarEstructura, setEditarEstructura] = useState(false);

  // Precargar datos cuando estamos editando y ya llegó el detalle
  useEffect(() => {
    if (!esEdicion || !productoExistente) return;

    setForm({
      nombre: productoExistente.nombre ?? "",
      descripcion: productoExistente.descripcion ?? "",
      categoria_id: productoExistente.categoria_id ?? "",
      genero_id: productoExistente.genero_id ?? "",
      tipo_bota_ids: productoExistente.Tipos_bota?.map(t => t.id) ?? [],
      precio: productoExistente.precio ?? "",
      precio_mayor: productoExistente.precio_mayor ?? "",
      stock: productoExistente.stock ?? 0,
      permite_personalizacion: Boolean(productoExistente.permite_personalizacion),
      tiempo_fabricacion: productoExistente.tiempo_fabricacion ?? 7
    });

    const modeloExistente = productoExistente.Modelos?.[0];
    if (modeloExistente) {
      const telaExistente = modeloExistente.Modelo_telas?.[0];
      setModelo({
        nombre: modeloExistente.nombre ?? "",
        descripcion: modeloExistente.descripcion ?? "",
        tipo_tela_id: telaExistente?.tipo_tela_id ?? telaExistente?.Tipos_tela?.id ?? "",
        precio: "",
        precio_mayor: "",
        colores: telaExistente?.Modelo_telas_colores?.map(c => c.color.id) ?? [],
        tallas: modeloExistente.Modelo_tallas?.map(t => t.talla_id ?? t.Talla?.id) ?? []
      });
    }
  }, [esEdicion, productoExistente]);

  // Reset al cerrar
  useEffect(() => {
    if (!show) {
      setForm(FORM_INICIAL);
      setModelo(MODELO_INICIAL);
      setImagenes([]);
      setEditarEstructura(false);
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleMulti = (field, id) => {
    setModelo(prev => {
      const exists = prev[field].includes(id);
      return {
        ...prev,
        [field]: exists ? prev[field].filter(x => x !== id) : [...prev[field], id]
      };
    });
  };

  const handleEliminarImagen = async (imagenId) => {
    const ok = await confirmarAccion({
      titulo: "¿Eliminar esta imagen?",
      texto: "Esta acción no se puede deshacer",
      icon: "warning"
    });
    if (!ok) return;

    try {
      await api.delete(`/productos/${productId}/imagenes/${imagenId}`);
      notifySuccess("Imagen eliminada");
      refetchProducto();
    } catch {
      notifyError("No se pudo eliminar la imagen");
    }
  };

  const handleReemplazarImagen = async (imagenId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("imagen", file);

    try {
      await api.put(`/productos/${productId}/imagenes/${imagenId}`, formData);
      notifySuccess("Imagen reemplazada");
      refetchProducto();
    } catch {
      notifyError("No se pudo reemplazar la imagen");
    }
  };

  const handleMarcarPrincipal = async (imagenId) => {
    try {
      await api.put(`/productos/${productId}/imagenes/${imagenId}/principal`);
      notifySuccess("Imagen principal actualizada");
      refetchProducto();
    } catch {
      notifyError("No se pudo actualizar la imagen principal");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    formData.append("categoria_id", form.categoria_id);
    formData.append("genero_id", form.genero_id);
    formData.append("tipo_bota_ids", JSON.stringify(form.tipo_bota_ids));
    formData.append("precio", form.precio);
    formData.append("precio_mayor", form.precio_mayor);
    formData.append("stock", form.stock);
    formData.append("permite_personalizacion", form.permite_personalizacion);
    formData.append("tiempo_fabricacion", form.tiempo_fabricacion);

    // En creación siempre mandamos modelos; en edición solo si el usuario decidió tocar la estructura
    if (!esEdicion || editarEstructura) {
      const modelosPayload = [
        {
          nombre: modelo.nombre,
          descripcion: modelo.descripcion,
          telas: [
            {
              tipo_tela_id: modelo.tipo_tela_id,
              colores: modelo.colores
            }
          ],
          tallas: modelo.tallas
        }
      ];
      formData.append("modelos", JSON.stringify(modelosPayload));
    }

    if (imagenes.length > 0) {
      imagenes.forEach(img => formData.append("imagenes", img));
    }

    try {
      if (esEdicion) {
        await put(productId, formData);
        onUpdated?.();
      } else {
        await post(formData);
        onCreated?.();
      }
      onClose();
    } catch {
      // el error queda en el estado del hook correspondiente
    }
  };

  if (!show) return null;

  const error = esEdicion ? errorPut : errorPost;
  const guardandoActual = esEdicion ? actualizando : guardando;

  if (esEdicion && cargandoProducto) {
    return (
      <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content p-4 text-center">
            Cargando producto...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{esEdicion ? "Editar producto" : "Registrar producto"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  {error.response?.data?.message || "Error al guardar el producto"}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label">Nombre</label>
                  <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select name="categoria_id" className="form-select" value={form.categoria_id} onChange={handleChange} required>
                    <option value="">Seleccione...</option>
                    {categorias?.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Género</label>
                  <select name="genero_id" className="form-select" value={form.genero_id} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {generos?.map(g => (
                      <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Tipos de bota (opcional)</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {tiposBota?.map(tipo => (
                      <button
                        key={tipo.id}
                        type="button"
                        className={`btn btn-sm ${form.tipo_bota_ids.includes(tipo.id) ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => setForm(prev => ({
                          ...prev,
                          tipo_bota_ids: prev.tipo_bota_ids.includes(tipo.id)
                            ? prev.tipo_bota_ids.filter(id => id !== tipo.id)
                            : [...prev.tipo_bota_ids, tipo.id]
                        }))}
                      >
                        {tipo.nombre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Tiempo de fabricación (días)</label>
                  <input
                    type="number"
                    name="tiempo_fabricacion"
                    className="form-control"
                    value={form.tiempo_fabricacion}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="permite_personalizacion"
                      name="permite_personalizacion"
                      checked={form.permite_personalizacion}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="permite_personalizacion">
                      Permite personalización
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Precio base</label>
                  <input
                    type="number"
                    name="precio"
                    className="form-control"
                    value={form.precio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Precio mayorista base</label>
                  <input
                    type="number"
                    name="precio_mayor"
                    className="form-control"
                    value={form.precio_mayor}
                    onChange={handleChange}
                  />
                </div>
<div className="col-12">
  <label className="form-label">
    {esEdicion ? "Imágenes actuales" : "Imágenes del producto"}
  </label>

  {esEdicion && productoExistente?.Producto_imagenes?.length > 0 && (
    <div className="d-flex flex-wrap gap-3 mb-3">
      {productoExistente.Producto_imagenes.map(img => (
        <div key={img.id} className="text-center" style={{ width: 90 }}>
          <div style={{ position: "relative" }}>
            <img
              src={`${SERVER_URL}${img.imagen}`}
              alt="actual"
              style={{
                width: 80, height: 80, objectFit: "cover", borderRadius: 6,
                border: img.principal ? "3px solid #198754" : "1px solid #ccc"
              }}
            />
            <button
              type="button"
              className="btn btn-sm btn-danger"
              style={{ position: "absolute", top: -8, right: -8, borderRadius: "50%", padding: "0 6px", lineHeight: "20px" }}
              onClick={() => handleEliminarImagen(img.id)}
              title="Eliminar"
            >
              ×
            </button>
          </div>

          {img.principal ? (
            <small className="text-success d-block mt-1">Principal</small>
          ) : (
            <button
              type="button"
              className="btn btn-link btn-sm p-0 d-block mx-auto mt-1"
              onClick={() => handleMarcarPrincipal(img.id)}
            >
              Marcar principal
            </button>
          )}

          <label className="btn btn-outline-secondary btn-sm mt-1 w-100" style={{ fontSize: 11 }}>
            Cambiar
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={(e) => handleReemplazarImagen(img.id, e.target.files?.[0])}
            />
          </label>
        </div>
      ))}
    </div>
  )}

  <ImageUploaderMultiple onImagesSelected={setImagenes} />
</div>
</div>
              <hr className="my-4" />

              {esEdicion && (
                <div className="form-check form-switch mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="editarEstructura"
                    checked={editarEstructura}
                    onChange={(e) => setEditarEstructura(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="editarEstructura">
                    Editar modelo, tela, colores y tallas
                  </label>
                  <div className="form-text">
                    Solo se puede hacer si el producto aún no tiene pedidos asociados.
                  </div>
                </div>
              )}

              {(!esEdicion || editarEstructura) && (
                <>
                  <h6>Modelo</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre del modelo</label>
                      <input
                        className="form-control"
                        value={modelo.nombre}
                        onChange={(e) => setModelo(prev => ({ ...prev, nombre: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tipo de tela</label>
                      <select
                        className="form-select"
                        value={modelo.tipo_tela_id}
                        onChange={(e) => setModelo(prev => ({ ...prev, tipo_tela_id: e.target.value }))}
                        required
                      >
                        <option value="">Seleccione...</option>
                        {tiposTela?.map(t => (
                          <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Colores</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {colores?.map(c => (
                          <span
                            key={c.id}
                            onClick={() => toggleMulti("colores", c.id)}
                            style={{
                              width: 28, height: 28, borderRadius: "50%",
                              background: c.codigo_hex, cursor: "pointer",
                              border: modelo.colores.includes(c.id) ? "3px solid #000" : "1px solid #ccc"
                            }}
                            title={c.nombre}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Tallas</label>
                      <div className="d-flex gap-2 flex-wrap">
                        {tallas?.map(t => (
                          <button
                            key={t.id}
                            type="button"
                            className={`btn btn-sm ${modelo.tallas.includes(t.id) ? "btn-dark" : "btn-outline-dark"}`}
                            onClick={() => toggleMulti("tallas", t.id)}
                          >
                            {t.nombre}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-dark" disabled={guardandoActual}>
                {guardandoActual ? "Guardando..." : esEdicion ? "Guardar cambios" : "Registrar producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}