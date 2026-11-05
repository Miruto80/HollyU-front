import { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import { usePutFetch } from "../../hooks/usePutFetch";
import { alertaError, obtenerMensajeError } from "../../utils/Alert";

const getInitialForm = (descuento) => descuento ? ({
  nombre: descuento.nombre || "",
  tipo_descuento_id: descuento.tipo_descuento_id ? String(descuento.tipo_descuento_id) : "",
  categoria_id: descuento.categoria_id ? String(descuento.categoria_id) : "",
  valor: descuento.valor ?? "",
  fecha_inicio: descuento.fecha_inicio ? descuento.fecha_inicio.slice(0, 10) : "",
  fecha_fin: descuento.fecha_fin ? descuento.fecha_fin.slice(0, 10) : "",
  activo: !!descuento.activo,
  productos: Array.isArray(descuento.Productos) ? descuento.Productos.map((p) => Number(p.id)) : []
}) : ({
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

  const { post, loading: creating } = usePostFetch("/descuentos");
  const { put, loading: updating } = usePutFetch("/descuentos");

  const formik = useFormik({
    initialValues: getInitialForm(descuento),
    enableReinitialize: true,
    validationSchema: Yup.object({
      nombre: Yup.string().trim().required("Ingresa el nombre del descuento"),
      tipo_descuento_id: Yup.string().required("Selecciona el tipo de descuento"),
      valor: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? NaN : value)
        .typeError("Ingresa un valor numérico")
        .min(0, "El valor no puede ser negativo")
        .required("Ingresa el valor del descuento"),
      fecha_inicio: Yup.string(),
      fecha_fin: Yup.string().test(
        "fecha-fin-posterior",
        "La fecha final debe ser igual o posterior a la fecha inicial",
        function (value) {
          return !value || !this.parent.fecha_inicio || value >= this.parent.fecha_inicio;
        }
      )
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        tipo_descuento_id: Number(values.tipo_descuento_id),
        categoria_id: values.categoria_id ? Number(values.categoria_id) : null,
        valor: Number(values.valor),
        productos: values.productos.map((id) => Number(id)),
        activo: !!values.activo
      };

      try {
        if (descuento?.id) {
          await put(descuento.id, payload);
        } else {
          await post(payload);
        }

        onSaved?.();
        onClose();
      } catch (submitError) {
        await alertaError(
          "No se pudo guardar el descuento",
          obtenerMensajeError(submitError, "Ocurrió un error al guardar los cambios.")
        );
      }
    }
  });
  const { resetForm } = formik;

  useEffect(() => {
    resetForm({ values: getInitialForm(descuento) });
  }, [descuento, show, resetForm]);

  const selectedProducts = useMemo(
    () => productos.filter((producto) => formik.values.productos.includes(Number(producto.id))),
    [productos, formik.values.productos]
  );

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const errors = await formik.validateForm();
    formik.setTouched(
      Object.keys(formik.values).reduce((touched, field) => ({ ...touched, [field]: true }), {}),
      false
    );

    const firstError = Object.values(errors).find((message) => typeof message === "string");
    if (firstError) {
      await alertaError("Revisa el formulario", firstError);
      return;
    }

    await formik.submitForm();
  };

  const toggleProducto = (productoId) => {
    const current = formik.values.productos || [];
    const exists = current.includes(Number(productoId));
    formik.setFieldValue(
      "productos",
      exists
        ? current.filter((id) => Number(id) !== Number(productoId))
        : [...current, Number(productoId)]
    );
  };

  if (!show) return null;

  const saving = creating || updating;
  const fieldError = (name) => formik.touched[name] && formik.errors[name];
  const fieldClass = (name) => {
    if (!formik.touched[name]) return "";
    return formik.errors[name] ? "is-invalid" : "is-valid";
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <form onSubmit={handleFormSubmit} noValidate>
            <div className="modal-header">
              <h5 className="modal-title">{descuento ? "Editar descuento" : "Crear descuento"}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del descuento</label>
                  <input
                    name="nombre"
                    className={`form-control ${fieldClass("nombre")}`}
                    value={formik.values.nombre}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {fieldError("nombre") && <div className="invalid-feedback">{fieldError("nombre")}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label">Tipo</label>
                  <select
                    name="tipo_descuento_id"
                    className={`form-select ${fieldClass("tipo_descuento_id")}`}
                    value={formik.values.tipo_descuento_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Seleccione...</option>
                    {tiposDescuento.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                    ))}
                  </select>
                  {fieldError("tipo_descuento_id") && <div className="invalid-feedback">{fieldError("tipo_descuento_id")}</div>}
                </div>

                <div className="col-md-3">
                  <label className="form-label">Valor</label>
                  <input
                    type="number"
                    name="valor"
                    className={`form-control ${fieldClass("valor")}`}
                    value={formik.values.valor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min="0"
                    step="0.01"
                  />
                  {fieldError("valor") && <div className="invalid-feedback">{fieldError("valor")}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Aplicar a categoría</label>
                  <select
                    name="categoria_id"
                    className={`form-select ${fieldClass("categoria_id")}`}
                    value={formik.values.categoria_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                    className={`form-control ${fieldClass("fecha_inicio")}`}
                    value={formik.values.fecha_inicio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Hasta</label>
                  <input
                    type="date"
                    name="fecha_fin"
                    className={`form-control ${fieldClass("fecha_fin")}`}
                    value={formik.values.fecha_fin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {fieldError("fecha_fin") && <div className="invalid-feedback">{fieldError("fecha_fin")}</div>}
                </div>

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="descuentoActivo"
                      name="activo"
                      checked={formik.values.activo}
                      onChange={formik.handleChange}
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
                          const selected = formik.values.productos.includes(Number(producto.id));
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
              <button type="submit" className="btn btn-dark" disabled={saving || formik.isSubmitting}>
                {saving ? "Guardando..." : descuento ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
