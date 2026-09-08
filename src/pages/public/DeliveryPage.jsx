import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../../components/home/StepIndicator";
import "../../assets/css/CartFlow.css";

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

        <div className="cart-flow-actions">
          <button type="button" className="cart-flow-back-btn" onClick={() => navigate("/cart")}>
            ← Regresar al carrito
          </button>

          <button type="button" className="cart-flow-primary" onClick={() => navigate("/checkout")}>
            Continuar al Pago →
          </button>
        </div>
      </div>
    </main>
  );
}
