import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/home/StepIndicator";
import GuestDataModal from "../../components/catalog/GuestModal";
import { openTermsModal } from "../../components/catalog/Terms";
import { useCart } from "../../hooks/useCart";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import { SERVER_URL } from "../../services/api";
import { obtenerTasaDolar } from "../../utils/Tasa";
import { notifySuccess } from "../../utils/Tostify";
import { getUnitPrice, esPrecioMayor } from "../../utils/Pricing";
import { FORMATO_TELEFONO_VENEZOLANO, formatearTelefonoVenezolano } from "../../utils/Telefono";
import { alertaError, obtenerMensajeError } from "../../utils/Alert";
import "../../assets/css/Checkout.css";

const BANCOS_VENEZUELA = [
  { codigo: "0102", nombre: "0102 - Banco de Venezuela" },
  { codigo: "0105", nombre: "0105 - Mercantil" },
  { codigo: "0134", nombre: "0134 - Banesco" },
  { codigo: "0108", nombre: "0108 - Provincial" },
  { codigo: "0163", nombre: "0163 - Banco del Tesoro" },
];

const ESTADO_PEDIDO_PENDIENTE = 1;
const TIPO_VENTA_CATALOGO = 1;
const METODO_PAGO_MOVIL = 1;
const ESTADO_PAGO_PENDIENTE = 1;
const DELIVERY_STORAGE_KEY = "hollyu.delivery";
const PAGO_INICIAL = {
  bancoOrigen: "",
  bancoDestino: "",
  referencia: "",
  telefono: "",
  comprobante: null,
  aceptaTerminos: false,
};

const pagoSchema = Yup.object({
  bancoOrigen: Yup.string().required("Selecciona el banco de origen"),
  bancoDestino: Yup.string().required("Selecciona el banco de destino"),
  referencia: Yup.string()
    .matches(/^\d+$/, "La referencia solo debe contener números")
    .required("Ingresa la referencia bancaria"),
  telefono: Yup.string()
    .matches(FORMATO_TELEFONO_VENEZOLANO, "Usa el formato 04xx-xxxxxxxx")
    .required("Ingresa el teléfono del emisor"),
  comprobante: Yup.mixed().required("Adjunta el comprobante de pago"),
  aceptaTerminos: Yup.boolean().oneOf([true], "Debes aceptar los términos y condiciones")
});

const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`;

const getDiscountForItem = (item, descuentos, unitPrice) => {
  const now = new Date();

  const aplicables = (descuentos || []).filter((descuento) => {
    if (!descuento.activo) return false;

    const fechaInicio = descuento.fecha_inicio ? new Date(descuento.fecha_inicio) : null;
    const fechaFin = descuento.fecha_fin ? new Date(descuento.fecha_fin) : null;

    if (fechaInicio && now < fechaInicio) return false;
    if (fechaFin && now > fechaFin) return false;

    const categoryMatch = descuento.categoria_id != null && Number(descuento.categoria_id) === Number(item.categoria_id);
    const productMatch = Array.isArray(descuento.Productos) && descuento.Productos.some((producto) => Number(producto.id) === Number(item.producto_id));

    return categoryMatch || productMatch;
  });

  if (!aplicables.length) return { discountAmount: 0, discountLabel: "" };

  const descuento = aplicables[0];
  const quantity = Number(item.cantidad || 1);

  if (descuento.Tipos_descuento?.nombre === "Porcentaje") {
    const descuentoUnitario = unitPrice * (Number(descuento.valor || 0) / 100);
    return {
      discountAmount: descuentoUnitario * quantity,
      discountLabel: `${Number(descuento.valor).toFixed(2)}% de descuento`
    };
  }

  const fixedAmount = Number(descuento.valor || 0);
  return {
    discountAmount: fixedAmount * quantity,
    discountLabel: `${formatMoney(fixedAmount)} de descuento`
  };
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();

  const isLogged = Boolean(localStorage.getItem("accessToken"));
  const [tasaDia, setTasaDia] = useState(1);
  const [deliveryData] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(DELIVERY_STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  });

  const { data: clienteLogueado, error: errorCliente, loading: cargandoCliente } = useGetFetch(
    isLogged ? "/clientes/me" : null
  );

  const [clienteInvitado, setClienteInvitado] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const { data: descuentos = [] } = useGetFetch("/descuentos");
  const { post: postPedido, loading: enviando } = usePostFetch("/pedidos");

  const itemsWithDiscount = items.map((item) => {
  const unitPrice = getUnitPrice(item);
  const discountInfo = getDiscountForItem(item, descuentos, unitPrice);
  const subtotal = Number(item.cantidad || 0) * unitPrice;
  const discountedSubtotal = Math.max(0, subtotal - discountInfo.discountAmount);

  return {
    ...item,
    unitPrice,
    esMayor: esPrecioMayor(item),
    subtotal,
    discountAmount: Number(discountInfo.discountAmount || 0),
    discountedSubtotal,
    discountLabel: discountInfo.discountLabel,
  };
});
const totalSubtotalSinDescuento = itemsWithDiscount.reduce((sum, item) => sum + item.subtotal, 0);
const totalDiscount = itemsWithDiscount.reduce((sum, item) => sum + item.discountAmount, 0);
const totalConDescuento = itemsWithDiscount.reduce((sum, item) => sum + item.discountedSubtotal, 0);

  const formik = useFormik({
    initialValues: PAGO_INICIAL,
    validationSchema: pagoSchema,
    onSubmit: async (values) => {
      if (items.length === 0) {
        await alertaError("Carrito vacío", "Agrega productos antes de realizar el pedido.");
        return;
      }

      if (!clienteId) {
        await alertaError("No se pudieron identificar tus datos", "Completa tus datos para continuar.");
        setShowGuestModal(true);
        return;
      }

      if (!deliveryData?.metodoEntrega) {
        await alertaError("Falta el método de entrega", "Completa los datos de entrega antes de pagar.");
        navigate("/entrega");
        return;
      }

      try {
        const itemsPayload = itemsWithDiscount.map(item => ({
          producto_id: item.producto_id,
          producto_modelo_id: item.producto_modelo_id,
          modelo_tela_id: item.modelo_tela_id,
          color_id: item.color_id,
          talla_id: item.talla_id,
          tipo_bota_id: item.tipo_bota_id,
          cantidad: item.cantidad,
          precio: item.unitPrice,
          descuento: Number(item.discountAmount || 0)
        }));

        const formData = new FormData();
        formData.append("cliente_id", clienteId);
        formData.append("tipo_venta_id", TIPO_VENTA_CATALOGO);
        formData.append("estado_pedido_id", ESTADO_PEDIDO_PENDIENTE);
        formData.append("metodo_pago_id", METODO_PAGO_MOVIL);
        formData.append("estado_pago_id", ESTADO_PAGO_PENDIENTE);
        formData.append("referencia", values.referencia.trim());
        formData.append("banco_origen", values.bancoOrigen);
        formData.append("banco_destino", values.bancoDestino);
        formData.append("telefono_emisor", values.telefono.trim());
        formData.append("total_bs", totalBs);
        formData.append("metodo_entrega", deliveryData.metodoEntrega);
        formData.append("agencia_envio", deliveryData.agenciaEnvio || "");
        formData.append("sucursal_envio", deliveryData.sucursalEnvio || "");
        formData.append("servicio_delivery", deliveryData.servicioDelivery || "");
        formData.append("zona_entrega", deliveryData.zona || "");
        formData.append("parroquia_entrega", deliveryData.parroquia || "");
        formData.append("sector_entrega", deliveryData.sector || "");
        formData.append("direccion_entrega", deliveryData.direccionEntrega || "");
        formData.append("items", JSON.stringify(itemsPayload));

        if (values.comprobante) {
          formData.append("comprobante", values.comprobante);
        }

        const pedido = await postPedido(formData);

        notifySuccess("Pedido creado correctamente");
        clearCart();
        sessionStorage.removeItem(DELIVERY_STORAGE_KEY);
        navigate(`/pedido-confirmado/${pedido.id}`);

      } catch (submitError) {
        await alertaError(
          "No se pudo procesar el pedido",
          obtenerMensajeError(submitError, "Ocurrió un error al procesar el pago.")
        );
      }
    }
  });

  useEffect(() => {
    obtenerTasaDolar().then(tasa => setTasaDia(tasa));
  }, []);

  // Decide si mostrar el modal de invitado, una vez que ya sabemos el estado del login
  useEffect(() => {
    if (cargandoCliente) return;

    const necesitaDatos = (!isLogged || Boolean(errorCliente)) && !clienteInvitado;
    setShowGuestModal(necesitaDatos);
  }, [isLogged, errorCliente, cargandoCliente, clienteInvitado]);

  const clienteId = clienteLogueado?.id ?? clienteInvitado?.id;

  const totalBs = totalConDescuento * tasaDia;

  const fieldError = (name) => formik.touched[name] && formik.errors[name];
  const fieldClass = (name) => {
    if (!formik.touched[name]) return "";
    return formik.errors[name] ? "is-invalid" : "is-valid";
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const errors = await formik.validateForm();
    formik.setTouched(
      Object.keys(formik.values).reduce((touched, field) => ({ ...touched, [field]: true }), {}),
      false
    );

    const firstError = Object.values(errors).find((message) => typeof message === "string");
    if (firstError) {
      await alertaError("Revisa los datos del pago", firstError);
      return;
    }

    await formik.submitForm();
  };

  return (
    <div className="checkout-page">
      <StepIndicator pasoActual={3} />

      <GuestDataModal
        show={showGuestModal}
        onConfirm={(cliente) => {
          setClienteInvitado(cliente);
          setShowGuestModal(false);
        }}
      />

      <div className="container">
        <div className="row g-4">

          <div className="col-lg-6">
            <div className="checkout-card">
              <h4 className="mb-4">Completar pago | Pago Móvil</h4>

              <form onSubmit={handleFormSubmit} noValidate>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="pago-banco-origen">Banco de Origen</label>
                    <select
                      id="pago-banco-origen"
                      name="bancoOrigen"
                      className={`form-select ${fieldClass("bancoOrigen")}`}
                      value={formik.values.bancoOrigen}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Seleccione...</option>
                      {BANCOS_VENEZUELA.map((b) => (
                        <option key={b.codigo} value={b.codigo}>{b.nombre}</option>
                      ))}
                    </select>
                    {fieldError("bancoOrigen") && <div className="invalid-feedback">{fieldError("bancoOrigen")}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="pago-banco-destino">Banco de Destino</label>
                    <select
                      id="pago-banco-destino"
                      name="bancoDestino"
                      className={`form-select ${fieldClass("bancoDestino")}`}
                      value={formik.values.bancoDestino}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option value="">Seleccione...</option>
                      {BANCOS_VENEZUELA.map((b) => (
                        <option key={b.codigo} value={b.codigo}>{b.nombre}</option>
                      ))}
                    </select>
                    {fieldError("bancoDestino") && <div className="invalid-feedback">{fieldError("bancoDestino")}</div>}
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="pago-referencia">Referencia Bancaria</label>
                    <input
                      id="pago-referencia"
                      type="text"
                      name="referencia"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className={`form-control ${fieldClass("referencia")}`}
                      value={formik.values.referencia}
                      onChange={(event) => formik.setFieldValue("referencia", event.target.value.replace(/\D/g, ""))}
                      onBlur={formik.handleBlur}
                    />
                    {fieldError("referencia") && <div className="invalid-feedback">{fieldError("referencia")}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label" htmlFor="pago-telefono">Teléfono Emisor</label>
                    <input
                      id="pago-telefono"
                      type="text"
                      name="telefono"
                      inputMode="numeric"
                      pattern="04[0-9]{2}-[0-9]{8}"
                      placeholder="0412-12345678"
                      className={`form-control ${fieldClass("telefono")}`}
                      value={formik.values.telefono}
                      onChange={(event) => formik.setFieldValue("telefono", formatearTelefonoVenezolano(event.target.value))}
                      onBlur={formik.handleBlur}
                    />
                    {fieldError("telefono") && <div className="invalid-feedback">{fieldError("telefono")}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="pago-comprobante">Subir comprobante</label>
                  <input
                  id="pago-comprobante"
                  type="file"
                  name="comprobante"
                  className={`form-control ${fieldClass("comprobante")}`}
                  onChange={(event) => formik.setFieldValue("comprobante", event.currentTarget.files?.[0] || null)}
                  onBlur={() => formik.setFieldTouched("comprobante", true)}
                  />
                  {fieldError("comprobante") && <div className="invalid-feedback">{fieldError("comprobante")}</div>}
                </div>

                <div className="form-check form-switch mb-4">
                  <input
                    type="checkbox"
                    className={`form-check-input ${fieldClass("aceptaTerminos")}`}
                    id="aceptaTerminos"
                    name="aceptaTerminos"
                    checked={formik.values.aceptaTerminos}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <label className="form-check-label" htmlFor="aceptaTerminos">
                    Acepto los{" "}
                    <button
                      type="button"
                      onClick={openTermsModal}
                      className="btn btn-link p-0 align-baseline"
                      style={{ textDecoration: "underline" }}
                    >
                      Términos y Condiciones
                    </button>
                  </label>
                  {fieldError("aceptaTerminos") && <div className="text-danger small">{fieldError("aceptaTerminos")}</div>}
                </div>

                <button
                  type="submit"
                  className="checkout-submit-btn w-100 py-2"
                  disabled={enviando || formik.isSubmitting}
                >
                  {enviando ? "Procesando..." : "Realizar Pago"}
                </button>

                <p className="text-muted text-center mt-3 mb-0 small">
                  Compra con confianza, tu mejor elección te espera.
                </p>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="checkout-card checkout-info-card mb-3">
              <h6 className="checkout-accent-title">Datos del pago móvil</h6>
              <p className="mb-1">Banco Nacional de Credito (0191) C.I.: V-18.334.628 Telf.:0414-511-9764</p>
            </div>

            <div className="checkout-card">
              <h6 className="checkout-accent-title">Resumen del Pedido</h6>
              <p className="text-muted mb-3">
                {items.length} {items.length === 1 ? "producto" : "productos"}
              </p>

              {itemsWithDiscount.map((item) => (
               <div className="checkout-item" key={item.id}>
               <img
                src={item.imagen ? `${SERVER_URL}${item.imagen}` : "/images/no-image.jpg"}
                alt={item.nombre}
               />
    <div className="checkout-item-info">
      <p className="mb-1 fw-semibold">{item.nombre}</p>
      {item.modelo && (
    <p className="mb-0 text-muted small">Modelo: {item.modelo}</p>
  )}
      {item.talla_nombre && (
        <p className="mb-0 text-muted small">Talla: {item.talla_nombre}</p>
      )}
      {item.color_nombre && (
        <p className="mb-0 text-muted small">Color: {item.color_nombre}</p>
      )}
      {item.tipo_bota_nombre && (
        <p className="mb-0 text-muted small">Bota: {item.tipo_bota_nombre}</p>
      )}
      <p className="mb-0 text-muted small">
        Cantidad: {item.cantidad} × {formatMoney(item.unitPrice)}
      </p>
      {item.esMayor && (
        <p className="mb-0 text-success small fw-semibold">Precio al mayor aplicado</p>
      )}
      <p className="mb-0 fw-semibold">
        Subtotal: {formatMoney(item.discountedSubtotal)}
      </p>
      {item.discountAmount > 0 && (
        <p className="mb-0 text-success small">
          Descuento aplicado: -{formatMoney(item.discountAmount)}
        </p>
      )}
    </div>
  </div>
))}
              <hr />

              <div className="d-flex justify-content-between mb-1">
               <span>Subtotal:</span>
                <span>{formatMoney(totalSubtotalSinDescuento)}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="d-flex justify-content-between mb-1 text-success">
                  <span>Descuento:</span>
                  <span>-{formatMoney(totalDiscount)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-1">
                <strong>Total USD:</strong>
                <strong>{formatMoney(totalConDescuento)}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Total Bs:</strong>
                <strong className="text-success">
                  {totalBs.toLocaleString(undefined, { maximumFractionDigits: 2 })} Bs
                </strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}