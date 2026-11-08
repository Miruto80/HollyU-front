import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../hooks/useCart";
import { SERVER_URL } from "../../services/api";
import "../../assets/css/CartDropdown.css";

export default function CartDropdown({ show, onClose }) {
  const navigate = useNavigate();
  const { items, removeItem, updateCantidad, totalPrecio } = useCart();

  const handleFinalizarPedido = () => {
    onClose();
    navigate("/cart");
  };

  return (
    <div
      className={`offcanvas offcanvas-end ${show ? "show" : ""}`}
      style={{ visibility: show ? "visible" : "hidden" }}
      tabIndex="-1"
    >
      <div className="offcanvas-header justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faCartShopping} />
          <h5 className="m-0">Tu carrito</h5>
        </div>
        
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body d-flex flex-column p-3">
        {items.length === 0 ? (
          <div className="offcanvas-body d-flex flex-column align-items-center justify-content-center text-center">
            <FontAwesomeIcon icon={faCartShopping} className="cart-empty-icon mb-3" />
            <p className="text-muted fs-5 mb-0">Tu carrito está vacío.</p>
          </div>
        ) : (
          <>
            {/* Listado de productos */}
            <div className="flex-grow-1 overflow-y-auto mb-3">
              {items.map((item, index) => {
                const precioNum = Number(item.precio || 0);
                const subtotalItem = precioNum * item.cantidad;

                return (
                  <div key={item.idCart || `${item.id}-${item.modelo || index}`} className="d-flex gap-3 mb-3 pb-3 border-bottom position-relative">
                    
                    {/* Imagen del producto */}
                    <img
                      src={item.imagen ? `${SERVER_URL}${item.imagen}` : "/images/no-image.jpg"}
                      alt={item.nombre}
                      style={{ width: 65, height: 65, objectFit: "cover", borderRadius: 8 }}
                    />

                    {/* Información del producto */}
                    <div className="flex-grow-1 pe-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="mb-1 fw-bold text-dark">{item.nombre}</h6>
                      </div>
                      
                      {item.modelo && (
                        <p className="mb-1 text-muted small">
                          Modelo: {item.modelo}
                        </p>
                      )}

                      {/* Precio por unidad */}
                      <p className="mb-2 text-muted small">
                        ${precioNum.toFixed(2)} c/u
                      </p>

                      {/* Controles de cantidad y precio total*/}
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <div className="input-group input-group-sm w-auto border rounded-2" style={{ maxWidth: "110px" }}>
                          <button
                            className="btn btn-outline-secondary border-0 px-2 py-1"
                            onClick={() => updateCantidad(item.id, item.cantidad - 1, item.modelo)}
                          >
                            -
                          </button>
                          <span className="px-2 py-1 bg-white d-flex align-items-center justify-content-center small fw-bold" style={{ minWidth: "30px" }}>
                            {item.cantidad}
                          </span>
                          <button
                            className="btn btn-outline-secondary border-0 px-2 py-1"
                            onClick={() => updateCantidad(item.id, item.cantidad + 1, item.modelo)}
                          >
                            +
                          </button>
                        </div>

                        {/* Precio total del producto */}
                        <span className="fw-bold text-dark" style={{ fontSize: "1.05rem" }}>
                          ${subtotalItem.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Botón Eliminar  */}
                    <button
                      className="btn btn-sm btn-link text-danger p-0 position-absolute top-0 end-0"
                      onClick={() => removeItem(item.id, item.modelo)}
                      aria-label="Eliminar"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>

                  </div>
                );
              })}
            </div>

            {/* botón  */}
            <div className="mt-auto bg-light p-3 rounded-3 border">
              <div className="subir-en-movil">
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Total</span>
                  <span className="fw-bold fs-4 text-dark">${totalPrecio.toFixed(2)}</span>
                </div>
                
                
                <button 
                  className="btn w-100 py-2 text-white fw-bold shadow-sm" 
                  style={{ backgroundColor: "#10123d", borderRadius: "8px" }}
                  onClick={handleFinalizarPedido}
                >
                 Pagar pedido
                </button>
                
              </div>  
            </div>
          </>
        )}
      </div>
    </div>
  );
}