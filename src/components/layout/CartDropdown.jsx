import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../hooks/useCart";
import { SERVER_URL } from "../../services/api";
import "../../assets/css/CartDropdown.css";

export default function CartDropdown({ show, onClose }) {
  const navigate = useNavigate();
  const { items, removeItem, updateCantidad, totalPrecio } = useCart();

  const handleFinalizarPedido = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div
      className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
      style={{ visibility: show ? "visible" : "hidden" }}
      tabIndex="-1"
    >
      <div className="offcanvas-header">
        <h5>Tu carrito</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <div className="offcanvas-body d-flex flex-column">
        {items.length === 0 ? (
          <p className="text-muted">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="flex-grow-1">
              {items.map(item => (
                <div key={item.id} className="d-flex gap-3 mb-3 pb-3 border-bottom">
                  <img
                    src={item.imagen ? `${SERVER_URL}${item.imagen}` : "/images/no-image.jpg"}
                    alt={item.nombre}
                    style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                  />

                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.nombre}</h6>
                    <p className="mb-1 text-muted">
                      ${Number(item.precio).toLocaleString()}
                    </p>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateCantidad(item.id, item.cantidad - 1)}
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateCantidad(item.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-sm btn-link text-danger"
                    onClick={() => removeItem(item.id)}
                    aria-label="Eliminar"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong>${totalPrecio.toLocaleString()}</strong>
              </div>
              <button className="btn btn-dark w-100" onClick={handleFinalizarPedido}>
                Finalizar pedido
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}