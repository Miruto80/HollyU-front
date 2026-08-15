import { useState } from "react";
import StepIndicator from "../../components/home/StepIndicator";
import { useCart } from "../../hooks/useCart";
import { SERVER_URL } from "../../services/api";
import "../../assets/css/Checkout.css";

const BANCOS_VENEZUELA = [
  { codigo: "0102", nombre: "0102 - Banco de Venezuela" },
  { codigo: "0105", nombre: "0105 - Mercantil" },
  { codigo: "0134", nombre: "0134 - Banesco" },
  { codigo: "0108", nombre: "0108 - Provincial" },
  { codigo: "0163", nombre: "0163 - Banco del Tesoro" },
];

const TASA_DIA = 771.07; // valor de ejemplo, luego vendrá del backend

export default function Checkout() {
  const { items, totalPrecio } = useCart();

  const [pagoForm, setPagoForm] = useState({
    bancoOrigen: "",
    bancoDestino: "",
    referencia: "",
    telefono: "",
    comprobante: null,
    aceptaTerminos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setPagoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const totalBs = totalPrecio * TASA_DIA;

  return (
    <div className="checkout-page">
      <div className="checkout-topbar">
        <span className="checkout-rate">
          Tasa del día: {TASA_DIA.toFixed(2)} Bs
        </span>
      </div>

      <StepIndicator pasoActual={3} />

      <div className="container">
        <div className="row g-4">

          {/* Formulario de pago móvil */}
          <div className="col-lg-7">
            <div className="checkout-card">
              <h4 className="mb-4">Completar pago | Pago Móvil</h4>

              <form>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Banco de Origen</label>
                    <select
                      name="bancoOrigen"
                      className="form-select"
                      value={pagoForm.bancoOrigen}
                      onChange={handleChange}
                    >
                      <option value="">Seleccione...</option>
                      {BANCOS_VENEZUELA.map((b) => (
                        <option key={b.codigo} value={b.codigo}>
                          {b.nombre}
                        </option>
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
                    >
                      <option value="">Seleccione...</option>
                      {BANCOS_VENEZUELA.map((b) => (
                        <option key={b.codigo} value={b.codigo}>
                          {b.nombre}
                        </option>
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
                  className="btn btn-dark w-100 py-2"
                  disabled={!pagoForm.aceptaTerminos}
                >
                  Realizar Pago
                </button>

                <p className="text-muted text-center mt-3 mb-0 small">
                  Compra con confianza, tu mejor elección te espera.
                </p>
              </form>
            </div>
          </div>

          {/* Columna lateral */}
          <div className="col-lg-5">
            <div className="checkout-card checkout-info-card mb-4">
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