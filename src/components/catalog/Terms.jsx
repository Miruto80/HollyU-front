import { useEffect, useState } from "react";

export const openTermsModal = () => {
  window.dispatchEvent(new CustomEvent("openTermsModal"));
};

const termSections = [
  {
    title: "1. Generalidades",
    description:
      "Al acceder y utilizar este sitio web, usted acepta cumplir con los presentes Términos y Condiciones. Estos aplican a todas las compras realizadas a través de nuestra plataforma de comercio electrónico.",
  },
  {
    title: "2. Productos y Precios",
    description:
      "Todos los productos ofrecidos están sujetos a disponibilidad. Nos reservamos el derecho de modificar precios, descripciones y condiciones de venta sin previo aviso.",
  },
  {
    title: "3. Proceso de Compra",
    description:
      "El cliente debe verificar cuidadosamente los detalles del producto antes de confirmar su compra. Una vez realizado el pago, no se aceptan modificaciones ni cancelaciones del pedido.",
  },
  {
    title: "4. Pagos",
    description:
      "Aceptamos los métodos de pago indicados en el sitio web. Todos los pagos deben realizarse en su totalidad antes del envío del producto.",
  },
  {
    title: "5. Envíos",
    description:
      "Los tiempos de entrega son estimados y pueden variar según la ubicación y condiciones externas. No nos hacemos responsables por retrasos ocasionados por terceros.",
  },
  {
    title: "6. Política de No Devoluciones",
    description:
      "No aceptamos devoluciones ni cambios bajo ninguna circunstancia. Al realizar una compra, el cliente reconoce y acepta esta política. En caso de recibir un producto defectuoso o incorrecto, se deberá contactar al servicio de atención al cliente dentro de las 48 horas siguientes a la recepción para evaluar posibles soluciones.",
    highlight: true,
  },
  {
    title: "7. Responsabilidad",
    description:
      "No nos responsabilizamos por el uso indebido de los productos adquiridos. Nuestra responsabilidad se limita al valor del producto adquirido.",
  },
  {
    title: "8. Propiedad Intelectual",
    description:
      "Todo el contenido del sitio web (textos, imágenes, logotipos, etc.) está protegido por derechos de autor y no puede ser reproducido sin autorización.",
  },
];

export default function Terms() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    window.addEventListener("openTermsModal", handleOpen);
    window.addEventListener("closeTermsModal", handleClose);

    return () => {
      window.removeEventListener("openTermsModal", handleOpen);
      window.removeEventListener("closeTermsModal", handleClose);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        position: "fixed",
        inset: 0,
        padding: "1.5rem",
        background: "rgba(15, 23, 42, 0.6)",
        zIndex: 2147483647,
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "900px",
          zIndex: 2147483647,
          overflow: "hidden",
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document" style={{ margin: 0, maxWidth: "100%" }}>
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              borderRadius: "1.1rem",
              overflow: "hidden",
            }}
          >
            <div className="modal-header align-items-center border-0 bg-white px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    background: "#fce7f3",
                  }}
                >
                  <i className="fa-solid fa-file-contract" style={{ color: "#ec4899", fontSize: "0.85rem" }} />
                </div>
                <h3 id="terms-title" className="mb-0 fw-bold text-dark" style={{ fontSize: "1.05rem" }}>
                  Términos y Condiciones
                </h3>
              </div>

              <button
                type="button"
                className="btn btn-light rounded-circle p-2"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                style={{ width: "2.1rem", height: "2.1rem", lineHeight: 1 }}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="modal-body p-0" style={{ background: "#f8fafc", maxHeight: "72vh" }}>
              <div className="p-4" style={{ overflowY: "auto" }}>
                {termSections.map((section, index) => (
                  <div
                    key={section.title}
                    className="mb-3 border rounded-4"
                    style={{
                      background: section.highlight ? "#fff1f7" : "#f8fafc",
                      borderColor: section.highlight ? "#f9a8d4" : "#e2e8f0",
                    }}
                  >
                    <details open={index === 0}>
                      <summary
                        style={{
                          listStyle: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          padding: "0.9rem 1rem",
                          fontWeight: 700,
                          color: section.highlight ? "#831843" : "#1f2937",
                        }}
                      >
                        <span>{section.title}</span>
                        <i
                          className="fa-solid fa-chevron-down"
                          style={{
                            fontSize: "0.75rem",
                            transition: "transform 0.2s ease",
                            opacity: 0.7,
                          }}
                        />
                      </summary>

                      <div
                        className="px-3 pb-3 pt-1"
                        style={{
                          color: "#475569",
                          fontSize: "0.8rem",
                          lineHeight: "1.7",
                          borderTop: section.highlight ? "1px solid #fbcfe8" : "1px solid #e2e8f0",
                        }}
                      >
                        {section.description}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer border-0 bg-light px-4 py-3">
              <button
                type="button"
                className="btn btn-pink px-4 py-2 fw-semibold"
                onClick={() => setIsOpen(false)}
                style={{
                  background: "#ec4899",
                  color: "#fff",
                  borderRadius: "0.8rem",
                  border: "none",
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

