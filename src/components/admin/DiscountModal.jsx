import { useEffect, useMemo, useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import { usePutFetch } from "../../hooks/usePutFetch";

const getInitialForm = () => ({
  nombre: "",
  tipo_descuento_id: "",
  categoria_id: "",
  valor: "",
  fecha_inicio: "",
  fecha_fin: "",
  activo: true,
  productos: []
});

export default function DiscountModal({ show, onClose, onSaved, descuento = null }) {
  const { data: tiposDescuento = [] } = useGetFetch("/tipos-descuento");
  const { data: categorias = [] } = useGetFetch("/categorias");
  const { data: productos = [] } = useGetFetch("/productos");

  const { post, loading: creating, error: createError } = usePostFetch("/descuentos");
  const { put, loading: updating, error: updateError } = usePutFetch("/descuentos");

  const [form, setForm] = useState(getInitialForm());

  useEffect(() => {
    if (descuento) {
      setForm({
        nombre: descuento.nombre || "",
        tipo_descuento_id: descuento.tipo_descuento_id ? String(descuento.tipo_descuento_id) : "",
        categoria_id: descuento.categoria_id ? String(descuento.categoria_id) : "",
        valor: descuento.valor ?? "",
        fecha_inicio: descuento.fecha_inicio ? descuento.fecha_inicio.slice(0, 10) : "",
        fecha_fin: descuento.fecha_fin ? descuento.fecha_fin.slice(0, 10) : "",
        activo: !!descuento.activo,
        productos: Array.isArray(descuento.Productos) ? descuento.Productos.map((p) => Number(p.id)) : []
      });
      return;
    }

    setForm(getInitialForm());
  }, [descuento, show]);

  const selectedProducts = useMemo(
    () => productos.filter((producto) => form.productos.includes(Number(producto.id))),
    [productos, form.productos]
  );

  const toggleProducto = (productoId) => {
    setForm((prev) => {
      const current = prev.productos || [];
      const exists = current.includes(Number(productoId));
      return {
        ...prev,
        productos: exists
          ? current.filter((id) => Number(id) !== Number(productoId))
          : [...current, Number(productoId)]
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tipo_descuento_id: Number(form.tipo_descuento_id),
      categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
      valor: Number(form.valor),
      productos: form.productos.map((id) => Number(id)),
      activo: !!form.activo
    };

    try {
      if (descuento?.id) {
        await put(descuento.id, payload);
      } else {
        await post(payload);
      }

      onSaved?.();
      onClose();
    } catch (error) {
      // manejo del error por hook
    }
  };

  if (!show) return null;

  const error = createError || updateError;
  const saving = creating || updating;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{descuento ? "Editar descuento" : "Crear descuento"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  {error.response?.data?.message || "Error al guardar el descuento"}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del descuento</label>
                  <input
                    name="nombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Tipo</label>
                  <select
                    name="tipo_descuento_id"
                    className="form-select"
                    value={form.tipo_descuento_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {tiposDescuento.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Valor</label>
                  <input
                    type="number"
                    name="valor"
                    className="form-control"
                    value={form.valor}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Aplicar a categoría</label>
                  <select
                    name="categoria_id"
                    className="form-select"
                    value={form.categoria_id}
                    onChange={handleChange}
                  >
                    <option value="">Sin categoría específica</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Desde</label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    className="form-control"
                    value={form.fecha_inicio}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Hasta</label>
                  <input
                    type="date"
                    name="fecha_fin"
                    className="form-control"
                    value={form.fecha_fin}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="descuentoActivo"
                      name="activo"
                      checked={form.activo}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="descuentoActivo">
                      Activo
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Productos específicos</label>
                  <div className="border rounded p-3" style={{ maxHeight: 250, overflow: "auto" }}>
                    {productos.length === 0 ? (
                      <small className="text-muted">No hay productos disponibles.</small>
                    ) : (
                      <div className="row g-2">
                        {productos.map((producto) => {
                          const selected = form.productos.includes(Number(producto.id));
                          return (
                            <div key={producto.id} className="col-md-6">
                              <button
                                type="button"
                                className={`btn w-100 text-start ${selected ? "btn-dark" : "btn-outline-dark"}`}
                                onClick={() => toggleProducto(producto.id)}
                              >
                                {producto.nombre}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {selectedProducts.length > 0 && (
                    <small className="text-muted d-block mt-2">
                      Productos seleccionados: {selectedProducts.map((p) => p.nombre).join(", ")}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-dark" disabled={saving}>
                {saving ? "Guardando..." : descuento ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
