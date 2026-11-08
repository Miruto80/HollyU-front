import { useFormik } from "formik";
import * as Yup from "yup";
import { usePostFetch } from "../../hooks/usePostFetch";
import { FORMATO_TELEFONO_VENEZOLANO, formatearTelefonoVenezolano } from "../../utils/Telefono";
import { alertaError, obtenerMensajeError } from "../../utils/Alert";

const TIPO_CLIENTE_PARTICULAR = 1;

export default function GuestDataModal({ show, onConfirm, onClose }) {
  const { post, loading } = usePostFetch("/clientes/buscar-o-crear");

  const formik = useFormik({
    initialValues: {
      nombres: "",
      apellidos: "",
      documento: "",
      telefono: "",
      email: ""
    },
    validationSchema: Yup.object({
      nombres: Yup.string().trim().required("Ingresa tus nombres"),
      apellidos: Yup.string(),
      documento: Yup.string().matches(/^\d*$/, "El documento solo debe contener números"),
      telefono: Yup.string().matches(FORMATO_TELEFONO_VENEZOLANO, {
        message: "Usa el formato 04xx-xxxxxxx (11 dígitos)",
        excludeEmptyString: true
      }),
      email: Yup.string().trim().email("Ingresa un correo válido").required("Ingresa tu correo electrónico")
    }),
    onSubmit: async (values) => {
      try {
        const cliente = await post({
          ...values,
          tipo_cliente_id: TIPO_CLIENTE_PARTICULAR
        });
        onConfirm(cliente);
      } catch (submitError) {
        await alertaError(
          "No se pudieron guardar tus datos",
          obtenerMensajeError(submitError, "Intenta de nuevo.")
        );
      }
    }
  });

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

  const fieldError = (name) => formik.touched[name] && formik.errors[name];
  const fieldClass = (name) => {
    if (!formik.touched[name]) return "";
    return formik.errors[name] ? "is-invalid" : "is-valid";
  };

  if (!show) return null;

  return (
    <div className="product-modal">
      <div className="product-modal-dialog" style={{ maxWidth: 500 }}>
        <div className="product-modal-content">

          <div className="product-modal-header">
            <h5 className="product-modal-title">Completa tus datos</h5>
            {onClose && (
              <button
                type="button"
                className="product-modal-close"
                onClick={onClose}
                aria-label="Cerrar"
              >
                ×
              </button>
            )}
          </div>

          <div className="product-modal-body">
            <p className="text-muted mb-4">
              Necesitamos estos datos para procesar tu pedido.
            </p>

            <form onSubmit={handleFormSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="guest-nombres">Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    id="guest-nombres"
                    className={`form-control ${fieldClass("nombres")}`}
                    value={formik.values.nombres}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {fieldError("nombres") && <div className="invalid-feedback">{fieldError("nombres")}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="guest-apellidos">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    id="guest-apellidos"
                    className={`form-control ${fieldClass("apellidos")}`}
                    value={formik.values.apellidos}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="guest-documento">Documento</label>
                  <input
                    type="text"
                    name="documento"
                    id="guest-documento"
                    className={`form-control ${fieldClass("documento")}`}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formik.values.documento}
                    onChange={(event) => formik.setFieldValue("documento", event.target.value.replace(/\D/g, ""))}
                    onBlur={formik.handleBlur}
                  />
                  {fieldError("documento") && <div className="invalid-feedback">{fieldError("documento")}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label" htmlFor="guest-telefono">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    id="guest-telefono"
                    className={`form-control ${fieldClass("telefono")}`}
                    inputMode="numeric"
                    pattern="04[0-9]{2}-[0-9]{7}"
                    placeholder="0412-1234567"
                    value={formik.values.telefono}
                    onChange={(event) => formik.setFieldValue("telefono", formatearTelefonoVenezolano(event.target.value))}
                    onBlur={formik.handleBlur}
                  />
                  {fieldError("telefono") && <div className="invalid-feedback">{fieldError("telefono")}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label" htmlFor="guest-email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="guest-email"
                    className={`form-control ${fieldClass("email")}`}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {fieldError("email") && <div className="invalid-feedback">{fieldError("email")}</div>}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 mt-4 py-2"
                disabled={loading || formik.isSubmitting}
              >
                {loading ? "Guardando..." : "Continuar"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}