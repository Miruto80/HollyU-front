import { useEffect, useRef, useState } from "react";
import { usePostFetch } from "../../hooks/usePostFetch";
import { usePutFetch } from "../../hooks/usePutFetch";
import { SERVER_URL } from "../../services/api";

export default function CategoryModal({ show, onClose, onSaved, category = null }) {
  const { post, loading: creating, error: createError } = usePostFetch("/categorias");
  const { put, loading: updating, error: updateError } = usePutFetch("/categorias");

  const [form, setForm] = useState({ nombre: "", descripcion: "", activo: true });
  const [imagen, setImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const vistaPreviaTemporal = useRef(null);

  useEffect(() => {
    if (category) setForm({ nombre: category.nombre || "", descripcion: category.descripcion || "", activo: !!category.activo });
    else setForm({ nombre: "", descripcion: "", activo: true });
    setImagen(null);
    if (vistaPreviaTemporal.current) {
      URL.revokeObjectURL(vistaPreviaTemporal.current);
      vistaPreviaTemporal.current = null;
    }
    setVistaPrevia(category?.imagen ? `${SERVER_URL}${category.imagen}` : null);
  }, [category, show]);

  useEffect(() => () => {
    if (vistaPreviaTemporal.current) URL.revokeObjectURL(vistaPreviaTemporal.current);
  }, []);

  if (!show) return null;

  const submitting = creating || updating;
  const error = createError || updateError;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    if (vistaPreviaTemporal.current) {
      URL.revokeObjectURL(vistaPreviaTemporal.current);
      vistaPreviaTemporal.current = null;
    }

    const file = e.target.files?.[0] || null;
    setImagen(file);
    if (file) {
      vistaPreviaTemporal.current = URL.createObjectURL(file);
      setVistaPrevia(vistaPreviaTemporal.current);
    } else {
      setVistaPrevia(category?.imagen ? `${SERVER_URL}${category.imagen}` : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, String(value)));
      if (imagen) payload.append("imagen", imagen);

      if (category?.id) {
        await put(category.id, payload);
      } else {
        await post(payload);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      // error handled by hooks
    }
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{category ? "Editar categoría" : "Registrar categoría"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">{error.response?.data?.message || "Error en la operación"}</div>
              )}

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label htmlFor="imagen-categoria" className="form-label">Imagen de categoría</label>
                <input
                  id="imagen-categoria"
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                <div className="form-text">JPG, PNG o WEBP. Máximo 5 MB.</div>
                {vistaPrevia && (
                  <img
                    src={vistaPrevia}
                    alt="Vista previa de la categoría"
                    className="img-thumbnail mt-2"
                    style={{ maxHeight: "160px", objectFit: "cover" }}
                  />
                )}
              </div>

              <div className="form-check">
                <input type="checkbox" name="activo" id="activo" className="form-check-input" checked={form.activo} onChange={handleChange} />
                <label className="form-check-label" htmlFor="activo">Activo</label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-dark" disabled={submitting}>{submitting ? "Guardando..." : "Guardar"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
