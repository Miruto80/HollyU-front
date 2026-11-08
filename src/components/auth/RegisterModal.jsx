import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faIdCard, faLock, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { usePostFetch } from "../../hooks/usePostFetch";
import { FORMATO_TELEFONO_VENEZOLANO, formatearTelefonoVenezolano } from "../../utils/Telefono";
import { alertaError, obtenerMensajeError } from "../../utils/Alert";
import "../../assets/css/Register.css";

export default function RegisterModal({ show, onClose }) {
  const navigate = useNavigate();
  const { post, loading } = usePostFetch("/auth/register");

  const formik = useFormik({
    initialValues: {
      nombres: "",
      apellidos: "",
      documento: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      nombres: Yup.string().trim().required("Ingresa tus nombres"),
      apellidos: Yup.string().trim().required("Ingresa tus apellidos"),
      documento: Yup.string()
        .matches(/^\d+$/, "La cédula solo debe contener números")
        .required("Ingresa tu cédula"),
      email: Yup.string().trim().email("Ingresa un correo válido").required("Ingresa tu correo electrónico"),
      telefono: Yup.string().matches(FORMATO_TELEFONO_VENEZOLANO, {
        message: "Usa el formato 04xx-xxxxxxx (11 dígitos)",
        excludeEmptyString: true
      }),
      password: Yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("Ingresa una contraseña"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Confirma tu contraseña")
    }),
    onSubmit: async (values) => {
      const payload = { ...values };
      delete payload.confirmPassword;

      try {
        const result = await post(payload);
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("usuario", JSON.stringify(result.usuario));
        onClose();
        navigate("/");
      } catch (submitError) {
        await alertaError(
          "No se pudo crear la cuenta",
          obtenerMensajeError(submitError, "Ocurrió un error al registrar la cuenta.")
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
    <div className="register-modal" role="dialog" aria-modal="true" aria-labelledby="register-title">
      <div className="register-dialog">
        <div className="register-header">
          <div>
            <span className="register-eyebrow">HollyU</span>
            <h2 id="register-title">Crea tu cuenta</h2>
          </div>
          <button type="button" className="register-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        <p className="register-intro">Regístrate para guardar tus datos y consultar tus pedidos.</p>
        <form onSubmit={handleFormSubmit} noValidate>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="register-nombres">Nombres</label>
              <div className="register-input">
                <FontAwesomeIcon icon={faUser} />
                <input id="register-nombres" name="nombres" value={formik.values.nombres} onChange={formik.handleChange} onBlur={formik.handleBlur} className={fieldClass("nombres")} />
              </div>
              {fieldError("nombres") && <div className="text-danger small">{fieldError("nombres")}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="register-apellidos">Apellidos</label>
              <input id="register-apellidos" className={`form-control ${fieldClass("apellidos")}`} name="apellidos" value={formik.values.apellidos} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {fieldError("apellidos") && <div className="invalid-feedback">{fieldError("apellidos")}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="register-documento">Cédula</label>
              <div className="register-input">
                <FontAwesomeIcon icon={faIdCard} />
                <input id="register-documento" type="text" name="documento" inputMode="numeric" pattern="[0-9]*" value={formik.values.documento} onChange={(event) => formik.setFieldValue("documento", event.target.value.replace(/\D/g, ""))} onBlur={formik.handleBlur} className={fieldClass("documento")} />
              </div>
              {fieldError("documento") && <div className="text-danger small">{fieldError("documento")}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="register-email">Correo electrónico</label>
              <div className="register-input">
                <FontAwesomeIcon icon={faEnvelope} />
                <input id="register-email" type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className={fieldClass("email")} />
              </div>
              {fieldError("email") && <div className="text-danger small">{fieldError("email")}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="register-telefono">Teléfono</label>
              <div className="register-input">
                <FontAwesomeIcon icon={faPhone} />
                <input id="register-telefono" name="telefono" inputMode="numeric" pattern="04[0-9]{2}-[0-9]{7}" placeholder="0412-1234567" value={formik.values.telefono} onChange={(event) => formik.setFieldValue("telefono", formatearTelefonoVenezolano(event.target.value))} onBlur={formik.handleBlur} className={fieldClass("telefono")} />
              </div>
              {fieldError("telefono") && <div className="text-danger small">{fieldError("telefono")}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="register-password">Contraseña</label>
              <div className="register-input">
                <FontAwesomeIcon icon={faLock} />
                <input id="register-password" type="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className={fieldClass("password")} />
              </div>
              {fieldError("password") && <div className="text-danger small">{fieldError("password")}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="register-confirm">Confirmar contraseña</label>
              <input id="register-confirm" className={`form-control ${fieldClass("confirmPassword")}`} type="password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
              {fieldError("confirmPassword") && <div className="invalid-feedback">{fieldError("confirmPassword")}</div>}
            </div>
          </div>
          <button className="btn login-btn w-100 mt-4" type="submit" disabled={loading}>{loading ? "Creando cuenta..." : "Crear cuenta"}</button>
        </form>
      </div>
    </div>
  );
}