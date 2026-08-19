import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/home/StepIndicator";
import GuestDataModal from "../../components/catalog/GuestModal";
import { useCart } from "../../hooks/useCart";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import { SERVER_URL } from "../../services/api";
import { obtenerTasaDolar } from "../../utils/Tasa";
import { notifySuccess, notifyError } from "../../utils/Tostify";
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

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrecio, clearCart } = useCart();

  const isLogged = Boolean(localStorage.getItem("accessToken"));
  const [tasaDia, setTasaDia] = useState(1);

  const { data: clienteLogueado, error: errorCliente, loading: cargandoCliente } = useGetFetch(
    isLogged ? "/clientes/me" : null
  );

  const [clienteInvitado, setClienteInvitado] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const { post: postPedido, loading: enviando } = usePostFetch("/pedidos");

  const [pagoForm, setPagoForm] = useState({
    bancoOrigen: "",
    bancoDestino: "",
    referencia: "",
    telefono: "",
    comprobante: null,
    aceptaTerminos: false,
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setPagoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const totalBs = totalPrecio * tasaDia;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      notifyError("Tu carrito está vacío");
      return;
    }

    if (!clienteId) {
      notifyError("No se pudo identificar tus datos, intenta de nuevo");
      setShowGuestModal(true);
      return;
    }

    try {
      const itemsPayload = items.map(item => ({
        producto_id: item.producto_id,
        modelo_id: item.modelo_id,
        tipo_tela_id: item.tipo_tela_id,
        color_id: item.color_id,
        talla_id: item.talla_id,
        cantidad: item.cantidad,
        precio: item.precio,
        descuento: 0
      }));

      const formData = new FormData();
      formData.append("cliente_id", clienteId);
      formData.append("tipo_venta_id", TIPO_VENTA_CATALOGO);
      formData.append("estado_pedido_id", ESTADO_PEDIDO_PENDIENTE);
      formData.append("metodo_pago_id", METODO_PAGO_MOVIL);
      formData.append("estado_pago_id", ESTADO_PAGO_PENDIENTE);
      formData.append("referencia", pagoForm.referencia);
      formData.append("banco_origen", pagoForm.bancoOrigen);
      formData.append("banco_destino", pagoForm.bancoDestino);
      formData.append("telefono_emisor", pagoForm.telefono);
      formData.append("total_bs", totalBs);
      formData.append("items", JSON.stringify(itemsPayload));

      if (pagoForm.comprobante) {
        formData.append("comprobante", pagoForm.comprobante);
      }

      const pedido = await postPedido(formData);

      notifySuccess("Pedido creado correctamente");
      clearCart();
      navigate(`/pedido-confirmado/${pedido.id}`);

    } catch (error) {
      notifyError(error.response?.data?.message || "Error al procesar el pedido");
    }
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

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Banco de Origen</label>
                    <select
                      name="bancoOrigen"
                      className="form-select"
                      value={pagoForm.bancoOrigen}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {BANCOS_VENEZUELA.map((b) => (
                        <option key={b.codigo} value={b.codigo}>{b.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Banco de Destino</label>
                    <select
                      name="bancoDestino"
                      className="form-select"
                      value={pagoForm.bancoDestino}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {BANCOS_VENEZUELA.map((b) => (
                        <option key={b.codigo} value={b.codigo}>{b.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Referencia Bancaria</label>
                    <input
                      type="text"
                      name="referencia"
                      className="form-control"
                      value={pagoForm.referencia}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Teléfono Emisor</label>
                    <input
                      type="text"
                      name="telefono"
                      className="form-control"
                      value={pagoForm.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Subir comprobante</label>
                  <input
                    type="file"
                    name="comprobante"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-check form-switch mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="aceptaTerminos"
                    name="aceptaTerminos"
                    checked={pagoForm.aceptaTerminos}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="aceptaTerminos">
                    Acepto los <a href="/terminos">Términos y Condiciones</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="checkout-submit-btn w-100 py-2"
                  disabled={!pagoForm.aceptaTerminos || enviando}
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
              <p className="mb-1">Venezuela (0102) C.I.: V-30.352.937 Telf.: 0414-509.49.59</p>
              <p className="mb-0">Mercantil (0105) C.I.: V-11.787.299 Telf.: 0426-554.13.64</p>
            </div>

            <div className="checkout-card">
              <h6 className="checkout-accent-title">Resumen del Pedido</h6>
              <p className="text-muted mb-3">
                {items.length} {items.length === 1 ? "producto" : "productos"}
              </p>

              {items.map((item) => (
                <div className="checkout-item" key={item.id}>
                  <img
                    src={item.imagen ? `${SERVER_URL}${item.imagen}` : "/images/no-image.jpg"}
                    alt={item.nombre}
                  />
                  <div className="checkout-item-info">
                    <p className="mb-1 fw-semibold">{item.nombre}</p>
                    {item.talla_nombre && (
                      <p className="mb-0 text-muted small">Talla: {item.talla_nombre}</p>
                    )}
                    {item.color_nombre && (
                    <p className="mb-0 text-muted small">Color: {item.color_nombre}</p>
                    )}
                    <p className="mb-0 text-muted small">
                      Cantidad: {item.cantidad} × ${Number(item.precio).toLocaleString()}
                    </p>
                    <p className="mb-0 fw-semibold">
                      Subtotal: ${(item.cantidad * item.precio).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-1">
                <strong>Total USD:</strong>
                <strong>${totalPrecio.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <strong>Total Bs:</strong>
                <strong className="text-success">
                  Resultado: {totalBs.toLocaleString(undefined, { maximumFractionDigits: 2 })} Bs
                </strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}