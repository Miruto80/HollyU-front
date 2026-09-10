import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/home/StepIndicator";
import "../../assets/css/CartFlow.css";

const DELIVERY_STORAGE_KEY = "hollyu.delivery";

const DELIVERY_OPTIONS = [
  {
    id: "store",
    title: "Tienda física",
    subtitle: "Retiro presencial",
    icon: "🏪",
  },
  {
    id: "shipping",
    title: "Envíos nacionales",
    subtitle: "Agencias de envío",
    icon: "🚚",
  },
  {
    id: "delivery",
    title: "Delivery",
    subtitle: "Envío a domicilio",
    icon: "🏍️",
  },
];

export default function DeliveryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(DELIVERY_OPTIONS[0].id);
  const [form, setForm] = useState({
    agenciaEnvio: "",
    sucursalEnvio: "",
    servicioDelivery: "",
    zona: "",
    parroquia: "",
    sector: "",
    direccionEntrega: "Retiro en Tienda Física (HolyHoly)",
  });

  const handleChange = ({ target }) => {
    setForm((previous) => ({ ...previous, [target.name]: target.value }));
  };

  const continueToCheckout = () => {
    const requiredFields = {
      store: ["direccionEntrega"],
      shipping: ["agenciaEnvio", "sucursalEnvio"],
      delivery: ["servicioDelivery", "zona", "parroquia", "sector", "direccionEntrega"],
    };

    const missingField = requiredFields[selected].find((field) => !form[field].trim());
    if (missingField) {
      const firstInvalid = document.querySelector(`[name="${missingField}"]`);
      firstInvalid?.focus();
      return;
    }

    sessionStorage.setItem(
      DELIVERY_STORAGE_KEY,
      JSON.stringify({ metodoEntrega: selected, ...form })
    );
    navigate("/checkout");
  };

  const renderDetails = () => {
    if (selected === "store") {
      return (
        <div className="delivery-details">
          <h2>Retiro en tienda física</h2>
          <label>
            Ubicación principal
            <input
              name="direccionEntrega"
              value={form.direccionEntrega}
              readOnly
            />
          </label>
          <p className="delivery-hint">Carrera 17 con calle 11 exactamente frente a Ascardio! Barquisimeto- Edo- Lara.</p>
        </div>
      );
    }

    if (selected === "shipping") {
      return (
        <div className="delivery-details">
          <h2>Datos para envío nacional</h2>
          <div className="delivery-form-grid">
            <label>
              Empresa de envío
              <select name="agenciaEnvio" value={form.agenciaEnvio} onChange={handleChange}>
                <option value="">Selecciona agencia</option>
                <option value="MRW">MRW</option>
                <option value="Zoom">Zoom</option>
                <option value="Tealca">Tealca</option>
                <option value="Domesa">Domesa</option>
              </select>
            </label>
            <label>
              Sucursal o código
              <input
                name="sucursalEnvio"
                value={form.sucursalEnvio}
                onChange={handleChange}
                placeholder="Ej. MRW Barquisimeto Centro"
              />
            </label>
          </div>
        </div>
      );
    }

    return (
      <div className="delivery-details">
        <h2>Detalles de entrega express</h2>
        <div className="delivery-form-grid">
          <label>
            Tipo de delivery
            <select
              name="servicioDelivery"
              value={form.servicioDelivery}
              onChange={handleChange}
            >
              <option value="">Selecciona una opción</option>
              <option value="Delivery de la tienda">Delivery de la tienda</option>
              <option value="Delivery externo">Delivery externo</option>
            </select>
          </label>
          <label>
            Zona
            <select name="zona" value={form.zona} onChange={handleChange}>
              <option value="">Selecciona una zona</option>
              {['Norte', 'Sur', 'Este', 'Oeste', 'Centro'].map((zona) => <option key={zona} value={zona}>{zona}</option>)}
            </select>
          </label>
          <label>
            Parroquia
            <input name="parroquia" value={form.parroquia} onChange={handleChange} placeholder="Ej. Catedral" />
          </label>
          <label>
            Sector / urbanización
            <input name="sector" value={form.sector} onChange={handleChange} placeholder="Ej. Centro" />
          </label>
        </div>
        <label>
          Punto de referencia y dirección exacta
          <input
            name="direccionEntrega"
            value={form.direccionEntrega}
            onChange={handleChange}
            placeholder="Av. Lara con Av. Los Leones, edificio, piso y apartamento"
          />
        </label>
      </div>
    );
  };

  return (
    <main className="cart-flow-page">
      <div className="cart-flow-container">
        <h1 className="cart-flow-title">Método de Entrega</h1>
        <p className="cart-flow-subtitle">
          Selecciona cómo deseas recibir tu pedido o visitarnos en nuestra tienda física
        </p>

        <StepIndicator pasoActual={2} />

        <div className="delivery-options">
          {DELIVERY_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`delivery-option ${selected === option.id ? "selected" : ""}`}
              onClick={() => setSelected(option.id)}
            >
              <div className="delivery-icon">{option.icon}</div>
              <div className="delivery-text">
                <h3>{option.title}</h3>
                <p>{option.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {renderDetails()}

        <div className="cart-flow-actions">
          <button type="button" className="cart-flow-back-btn" onClick={() => navigate("/cart")}>
            ← Regresar al carrito
          </button>

          <button type="button" className="cart-flow-primary" onClick={continueToCheckout}>
            Continuar al Pago →
          </button>
        </div>
      </div>
    </main>
  );
}
