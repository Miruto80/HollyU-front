import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";

export default function PagoPaso({ pagos, setPagos, total }) {
  const { data: metodosPago } = useGetFetch("/metodos_pago");

  const [nuevoPago, setNuevoPago] = useState({ metodo_pago_id: "", monto: "" });

  const totalPagado = pagos.reduce((sum, p) => sum + Number(p.monto), 0);
  const restante = total - totalPagado;

  const agregarPago = () => {
    if (!nuevoPago.metodo_pago_id || !nuevoPago.monto) return;

    setPagos(prev => [...prev, { ...nuevoPago, monto: Number(nuevoPago.monto) }]);
    setNuevoPago({ metodo_pago_id: "", monto: "" });
  };

  const quitarPago = (index) => {
    setPagos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="row mb-3 text-center">
        <div className="col-4">
          <div className="border rounded p-2">
            <small className="text-muted">Total venta</small>
            <h5>${total.toLocaleString()}</h5>
          </div>
        </div>
        <div className="col-4">
          <div className="border rounded p-2">
            <small className="text-muted">Pagado</small>
            <h5 className="text-success">${totalPagado.toLocaleString()}</h5>
          </div>
        </div>
        <div className="col-4">
          <div className="border rounded p-2">
            <small className="text-muted">Restante</small>
            <h5 className={restante > 0 ? "text-warning" : "text-success"}>
              ${restante.toLocaleString()}
            </h5>
          </div>
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={nuevoPago.metodo_pago_id}
            onChange={(e) => setNuevoPago(p => ({ ...p, metodo_pago_id: e.target.value }))}
          >
            <option value="">Método de pago</option>
            {metodosPago?.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Monto"
            value={nuevoPago.monto}
            onChange={(e) => setNuevoPago(p => ({ ...p, monto: e.target.value }))}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-dark w-100" onClick={agregarPago}>+</button>
        </div>
      </div>

      {pagos.map((p, i) => {
        const metodo = metodosPago?.find(m => m.id === Number(p.metodo_pago_id));
        return (
          <div key={i} className="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
            <span>{metodo?.nombre} — ${Number(p.monto).toLocaleString()}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={() => quitarPago(i)}>×</button>
          </div>
        );
      })}

      {restante !== 0 && pagos.length > 0 && (
        <div className="alert alert-warning mt-2">
          Los pagos deben sumar exactamente el total de la venta.
        </div>
      )}
    </div>
  );
}