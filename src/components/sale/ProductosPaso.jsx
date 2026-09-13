import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import { notifyError } from "../../utils/Tostify";

export default function ProductosPaso({ items, setItems }) {
  const { data: productos } = useGetFetch("/productos");

  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState("");
  const { data: detalle, loading: cargandoDetalle } = useGetFetch(
    productoSeleccionadoId ? `/productos/${productoSeleccionadoId}` : null
  );

  const [modeloId, setModeloId] = useState("");
  const [telaId, setTelaId] = useState("");
  const [colorId, setColorId] = useState(null);
  const [tallaId, setTallaId] = useState(null);
  const [tipoBotaId, setTipoBotaId] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  const modelo = detalle?.Modelos?.find(m => String(m.id) === String(modeloId));
  const tela = modelo?.Modelo_telas?.find(t => String(t.id) === String(telaId));

  const resetSeleccion = () => {
    setProductoSeleccionadoId("");
    setModeloId("");
    setTelaId("");
    setColorId(null);
    setTallaId(null);
    setTipoBotaId(null);
    setCantidad(1);
  };

  const agregarItem = () => {
    if (!detalle) return;
    if (!modeloId) { notifyError("Selecciona un modelo"); return; }
    if (!telaId) { notifyError("Selecciona una tela"); return; }
    if (!colorId) { notifyError("Selecciona un color"); return; }
    if (!tallaId) { notifyError("Selecciona una talla"); return; }
    if (detalle.Tipos_bota?.length > 0 && !tipoBotaId) { notifyError("Selecciona un tipo de bota"); return; }
    if (!cantidad || cantidad < 1) { notifyError("Cantidad inválida"); return; }

    const colorObj = tela.Modelo_telas_colores.find(c => String(c.id) === String(colorId));
    const tallaObj = modelo.Modelo_tallas.find(t => String(t.id) === String(tallaId));

    setItems(prev => [
      ...prev,
      {
        key: `${Date.now()}_${Math.random()}`,
        producto_id: detalle.id,
        nombre: detalle.nombre,
        modelo_id: modelo.id,
        modelo_nombre: modelo.nombre,
        tipo_tela_id: tela.tipo_tela_id ?? tela.Tipos_tela?.id,
        tela_nombre: tela.Tipos_tela?.nombre,
        color_id: colorObj.color.id,
        color_nombre: colorObj.color.nombre,
        talla_id: tallaObj.Talla.id,
        talla_nombre: tallaObj.Talla.nombre,
        tipo_bota_id: tipoBotaId,
        tipo_bota_nombre: detalle.Tipos_bota?.find(t => String(t.id) === String(tipoBotaId))?.nombre,
        precio: Number(detalle.precio),
        cantidad: Number(cantidad)
      }
    ]);

    resetSeleccion();
  };

  const quitarItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const totalItems = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

  return (
    <div>
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <label className="form-label">Producto</label>
          <select
            className="form-select"
            value={productoSeleccionadoId}
            onChange={(e) => {
              setProductoSeleccionadoId(e.target.value);
              setModeloId(""); setTelaId(""); setColorId(null); setTallaId(null); setTipoBotaId(null);
            }}
          >
            <option value="">Seleccione...</option>
            {productos?.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        {detalle && !cargandoDetalle && (
          <>
            <div className="col-md-4">
              <label className="form-label">Modelo</label>
              <select
                className="form-select"
                value={modeloId}
                onChange={(e) => { setModeloId(e.target.value); setTelaId(""); setColorId(null); setTallaId(null); setTipoBotaId(null); }}
              >
                <option value="">Seleccione...</option>
                {detalle.Modelos?.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Tela</label>
              <select
                className="form-select"
                value={telaId}
                onChange={(e) => { setTelaId(e.target.value); setColorId(null); }}
                disabled={!modeloId}
              >
                <option value="">Seleccione...</option>
                {modelo?.Modelo_telas?.map(t => (
                  <option key={t.id} value={t.id}>{t.Tipos_tela?.nombre}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {tela && (
        <div className="row g-2 mb-3">
          <div className="col-12">
            <label className="form-label">Color</label>
            <div className="d-flex flex-wrap gap-2">
              {tela.Modelo_telas_colores?.map(c => (
                <span
                  key={c.id}
                  onClick={() => setColorId(c.id)}
                  style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: c.color.codigo_hex, cursor: "pointer",
                    border: String(colorId) === String(c.id) ? "3px solid #000" : "1px solid #ccc",
                    display: "inline-block"
                  }}
                  title={c.color.nombre}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {modelo && (
        <div className="row g-2 mb-3">
          <div className="col-12">
            <label className="form-label">Talla</label>
            <div className="d-flex flex-wrap gap-2">
              {modelo.Modelo_tallas?.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`btn btn-sm ${String(tallaId) === String(t.id) ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setTallaId(t.id)}
                >
                  {t.Talla?.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {detalle?.Tipos_bota?.length > 0 && (
        <div className="row g-2 mb-3">
          <div className="col-12">
            <label className="form-label">Tipo de bota</label>
            <div className="d-flex flex-wrap gap-2">
              {detalle.Tipos_bota.map(tipo => (
                <button
                  key={tipo.id}
                  type="button"
                  className={`btn btn-sm ${String(tipoBotaId) === String(tipo.id) ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setTipoBotaId(tipo.id)}
                >
                  {tipo.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {detalle && (
        <div className="row g-2 align-items-end mb-4">
          <div className="col-md-3">
            <label className="form-label">Cantidad</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Precio unitario</label>
            <input className="form-control" value={`$${Number(detalle.precio).toLocaleString()}`} disabled />
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-dark w-100" onClick={agregarItem}>
              + Agregar producto
            </button>
          </div>
        </div>
      )}

      <hr />

      {items.length === 0 ? (
        <p className="text-muted">No hay productos agregados.</p>
      ) : (
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Modelo</th>
              <th>Tela</th>
              <th>Color</th>
              <th>Talla</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.key}>
                <td>{item.nombre}</td>
                <td>{item.modelo_nombre}</td>
                <td>{item.tela_nombre}</td>
                <td>{item.color_nombre}</td>
                <td>{item.talla_nombre}</td>
                <td>{item.cantidad}</td>
                <td>${item.precio.toLocaleString()}</td>
                <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => quitarItem(item.key)}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="7" className="text-end fw-bold">Total:</td>
              <td className="fw-bold" colSpan="2">${totalItems.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}