import "../../assets/css/StepIndicator.css";

const PASOS = ["Producto", "Entrega", "Pago", "Confirmación"];

export default function StepIndicator({ pasoActual }) {
  return (
    <div className="step-indicator">
      {PASOS.map((label, index) => {
        const numero = index + 1;
        const activo = numero === pasoActual;
        const completado = numero < pasoActual;

        return (
          <div className="step-item" key={label}>
            <div className="step-item-row">
              <div
                className={`step-circle ${activo ? "step-active" : ""} ${completado ? "step-completed" : ""}`}
              >
                {numero}
              </div>
              {index < PASOS.length - 1 && <div className="step-line" />}
            </div>
            <span className={`step-label ${activo ? "step-label-active" : ""}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}