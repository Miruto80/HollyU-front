import { useState } from "react";
import { usePostFetch } from "../../hooks/usePostFetch";
import { notifySuccess, notifyError } from "../../utils/Tostify";
import ClientePaso from "../sale/ClientePaso";
import ProductosPaso from "../sale/ProductosPaso";
import PagoPaso from "../sale/PagoPaso";

const PASOS = ["Cliente", "Productos", "Pago"];

export default function SalesModal({ show, onClose, onCreated }) {
  const [paso, setPaso] = useState(0);
  const [cliente, setCliente] = useState(null);
  const [items, setItems] = useState([]);
  const [pagos, setPagos] = useState([]);

  const { post, loading } = usePostFetch("/pedidos/presencial");

  const totalVenta = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  const reset = () => {
    setPaso(0);
    setCliente(null);
    setItems([]);
    setPagos([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFinalizar = async () => {
    try {
      await post({
        cliente_id: cliente.id,
        items: items.map(i => ({
          producto_id: i.producto_id,
          modelo_id: i.modelo_id,
          tipo_tela_id: i.tipo_tela_id,
          color_id: i.color_id,
          talla_id: i.talla_id,
          tipo_bota_id: i.tipo_bota_id,
          cantidad: i.cantidad,
          precio: i.precio,
          descuento: 0
        })),
        pagos: pagos.map(p => ({
          metodo_pago_id: p.metodo_pago_id,
          monto: p.monto,
          referencia: p.referencia,
          banco_origen: p.banco_origen,
          banco_destino: p.banco_destino,
          telefono_emisor: p.telefono_emisor
        }))
      });

      notifySuccess("Venta registrada correctamente");
      onCreated?.();
      handleClose();
    } catch (error) {
      notifyError(error.response?.data?.message || "No se pudo registrar la venta");
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Registrar venta presencial</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            <div className="d-flex justify-content-center gap-4 mb-4">
              {PASOS.map((p, i) => (
                <div key={p} className={`text-center ${i === paso ? "fw-bold text-dark" : "text-muted"}`}>
                  <div
                    className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-1 ${i === paso ? "bg-dark text-white" : "bg-light"}`}
                    style={{ width: 32, height: 32 }}
                  >
                    {i + 1}
                  </div>
                  <div className="small">{p}</div>
                </div>
              ))}
            </div>

            {paso === 0 && (
              <ClientePaso cliente={cliente} onSelectCliente={setCliente} />
            )}

            {paso === 1 && (
              <ProductosPaso items={items} setItems={setItems} />
            )}

            {paso === 2 && (
              <PagoPaso pagos={pagos} setPagos={setPagos} total={totalVenta} />
            )}
          </div>

          <div className="modal-footer d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              disabled={paso === 0}
              onClick={() => setPaso(p => p - 1)}
            >
              Anterior
            </button>

            {paso < PASOS.length - 1 ? (
              <button
                className="btn btn-dark"
                disabled={
                  (paso === 0 && !cliente) ||
                  (paso === 1 && items.length === 0)
                }
                onClick={() => setPaso(p => p + 1)}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="btn btn-success"
                disabled={loading || pagos.length === 0}
                onClick={handleFinalizar}
              >
                {loading ? "Registrando..." : "Registrar venta"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}