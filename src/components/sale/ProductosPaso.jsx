import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import { notifyError } from "../../utils/Tostify";
import { getUnitPrice, esPrecioMayor } from "../../utils/Pricing";

const formatMoney = (value) => `$${Number(value || 0).toLocaleString()}`;

const getDiscountForProducto = (producto, cantidad, unitPrice, descuentos) => {
  const now = new Date();

  const aplicables = (descuentos || []).filter((descuento) => {
    if (!descuento.activo) return false;

    const fechaInicio = descuento.fecha_inicio ? new Date(descuento.fecha_inicio) : null;
    const fechaFin = descuento.fecha_fin ? new Date(descuento.fecha_fin) : null;

    if (fechaInicio && now < fechaInicio) return false;
    if (fechaFin && now > fechaFin) return false;

    const categoryMatch = descuento.categoria_id != null && Number(descuento.categoria_id) === Number(producto.categoria_id);
    const productMatch = Array.isArray(descuento.Productos) && descuento.Productos.some((p) => Number(p.id) === Number(producto.id));

    return categoryMatch || productMatch;
  });

  if (!aplicables.length) return { discountAmount: 0, discountLabel: "" };

  const descuento = aplicables[0];

  if (descuento.Tipos_descuento?.nombre === "Porcentaje") {
    const descuentoUnitario = unitPrice * (Number(descuento.valor || 0) / 100);
    return {
      discountAmount: descuentoUnitario * cantidad,
      discountLabel: `${Number(descuento.valor).toFixed(2)}% de descuento`
    };
  }

  const fixedAmount = Number(descuento.valor || 0);
  return {
    discountAmount: fixedAmount * cantidad,
    discountLabel: `${formatMoney(fixedAmount)} de descuento`
  };
};

export default function ProductosPaso({ items, setItems }) {
  const { data: productos } = useGetFetch("/productos");
  const { data: descuentos = [] } = useGetFetch("/descuentos");

  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState("");
  const { data: detalle, loading: cargandoDetalle } = useGetFetch(
    productoSeleccionadoId ? `/productos/${productoSeleccionadoId}` : null
  );

  // Estados de selección
  const [productoModeloId, setProductoModeloId] = useState("");
  const [modeloTelaId, setModeloTelaId] = useState("");
  const [colorId, setColorId] = useState(null);
  const [tallaId, setTallaId] = useState(null);
  const [tipoBotaId, setTipoBotaId] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // Mapeo seguro según las relaciones del backend
  const listaModelos = detalle?.Producto_modelos || detalle?.Modelos || [];
  
  const productoModeloObj = listaModelos.find(
    (pm) => String(pm.id) === String(productoModeloId) || String(pm.modelo_id) === String(productoModeloId)
  );

  const modeloObj = productoModeloObj?.Modelo || productoModeloObj;

  const listaTelas = productoModeloObj?.Modelo_telas || modeloObj?.Modelo_telas || [];
  const telaObj = listaTelas.find((t) => String(t.id) === String(modeloTelaId));

  const listaTallas = productoModeloObj?.Modelo_tallas || modeloObj?.Modelo_tallas || [];

  const cantidadNum = Number(cantidad) || 0;
  const unitPricePreview = detalle
    ? getUnitPrice({ precio: detalle.precio, precio_mayor: detalle.precio_mayor, cantidad: cantidadNum })
    : 0;
  const esMayorPreview = detalle
    ? esPrecioMayor({ precio_mayor: detalle.precio_mayor, cantidad: cantidadNum })
    : false;

  const resetSeleccion = () => {
    setProductoSeleccionadoId("");
    setProductoModeloId("");
    setModeloTelaId("");
    setColorId(null);
    setTallaId(null);
    setTipoBotaId(null);
    setCantidad(1);
  };

  const agregarItem = () => {
    if (!detalle) return;
    if (!productoModeloId) { notifyError("Selecciona un modelo"); return; }
    if (!modeloTelaId) { notifyError("Selecciona una tela"); return; }
    if (!colorId) { notifyError("Selecciona un color"); return; }
    if (!tallaId) { notifyError("Selecciona una talla"); return; }
    if (detalle.Tipos_bota?.length > 0 && !tipoBotaId) { notifyError("Selecciona un tipo de bota"); return; }
    if (!cantidadNum || cantidadNum < 1) { notifyError("Cantidad inválida"); return; }

    const colorObj = telaObj?.Modelo_telas_colores?.find((c) => String(c.id) === String(colorId) || String(c.color_id) === String(colorId));
    const tallaObj = listaTallas.find((t) => String(t.id) === String(tallaId) || String(t.talla_id) === String(tallaId));

    const unitPrice = getUnitPrice({ precio: detalle.precio, precio_mayor: detalle.precio_mayor, cantidad: cantidadNum });
    const esMayor = esPrecioMayor({ precio_mayor: detalle.precio_mayor, cantidad: cantidadNum });
    const discountInfo = getDiscountForProducto(detalle, cantidadNum, unitPrice, descuentos);

    // Mapeo adaptado con las claves exactas requeridas por el Backend
    setItems((prev) => [
      ...prev,
      {
        key: `${Date.now()}_${Math.random()}`,
        producto_id: detalle.id,
        nombre: detalle.nombre,
        
        producto_modelo_id: productoModeloObj?.id,
        modelo_nombre: modeloObj?.nombre || "Modelo",
        
        modelo_tela_id: telaObj?.id,
        tela_nombre: telaObj?.Tipos_tela?.nombre || "Tela",
        
        color_id: colorObj?.color?.id || colorObj?.color_id,
        color_nombre: colorObj?.color?.nombre || "Color",
        
        talla_id: tallaObj?.Talla?.id || tallaObj?.talla_id || tallaId,
        talla_nombre: tallaObj?.Talla?.nombre || "Talla",
        
        tipo_bota_id: tipoBotaId,
        tipo_bota_nombre: detalle.Tipos_bota?.find((t) => String(t.id) === String(tipoBotaId))?.nombre,
        
        precio: unitPrice,
        esMayor,
        descuento: Number(discountInfo.discountAmount || 0),
        discountLabel: discountInfo.discountLabel,
        cantidad: cantidadNum
      }
    ]);

    resetSeleccion();
  };

  const quitarItem = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const totalItems = items.reduce((sum, i) => sum + (i.precio * i.cantidad - i.descuento), 0);

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
              setProductoModeloId(""); setModeloTelaId(""); setColorId(null); setTallaId(null); setTipoBotaId(null);
            }}
          >
            <option value="">Seleccione...</option>
            {productos?.map((p) => (
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
                value={productoModeloId}
                onChange={(e) => {
                  setProductoModeloId(e.target.value);
                  setModeloTelaId(""); setColorId(null); setTallaId(null); setTipoBotaId(null);
                }}
              >
                <option value="">Seleccione...</option>
                {listaModelos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre || m.Modelo?.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Tela</label>
              <select
                className="form-select"
                value={modeloTelaId}
                onChange={(e) => { setModeloTelaId(e.target.value); setColorId(null); }}
                disabled={!productoModeloId}
              >
                <option value="">Seleccione...</option>
                {listaTelas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.Tipos_tela?.nombre}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {telaObj && (
  <div className="row g-2 mb-3">
    <div className="col-12">
      <label className="form-label">Color</label>
      <div className="d-flex flex-wrap gap-2">
        {telaObj.Modelo_telas_colores?.map((c) => (
          <span
            key={c.id}
            onClick={() => setColorId(c.id)}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: c.color?.codigo || c.color?.codigo_hex || "#ccc",
              cursor: "pointer",
              border: String(colorId) === String(c.id) ? "3px solid #000" : "1px solid #ccc",
              display: "inline-block"
            }}
            title={c.color?.nombre}
          />
        ))}
      </div>
    </div>
  </div>
)}

      {productoModeloObj && (
        <div className="row g-2 mb-3">
          <div className="col-12">
            <label className="form-label">Talla</label>
            <div className="d-flex flex-wrap gap-2">
              {listaTallas.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`btn btn-sm ${String(tallaId) === String(t.id) ? "btn-dark" : "btn-outline-dark"}`}
                  onClick={() => setTallaId(t.id)}
                >
                  {t.Talla?.nombre || t.nombre}
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
              {detalle.Tipos_bota.map((tipo) => (
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
            <input className="form-control" value={formatMoney(unitPricePreview)} disabled />
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-dark w-100" onClick={agregarItem}>
              + Agregar producto
            </button>
          </div>
          {esMayorPreview && (
            <div className="col-12">
              <span className="badge bg-success">Precio al mayor aplicado (12+ unidades)</span>
            </div>
          )}
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
              <th>Bota</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Descuento</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key}>
                <td>{item.nombre}</td>
                <td>{item.modelo_nombre}</td>
                <td>{item.tela_nombre}</td>
                <td>{item.color_nombre}</td>
                <td>{item.talla_nombre}</td>
                <td>{item.tipo_bota_nombre || "-"}</td>
                <td>{item.cantidad}</td>
                <td>
                  {formatMoney(item.precio)}
                  {item.esMayor && <div className="small text-success">Al mayor</div>}
                </td>
                <td className="text-danger">
                  {item.descuento > 0 ? `-${formatMoney(item.descuento)}` : "-"}
                </td>
                <td>{formatMoney(item.precio * item.cantidad - item.descuento)}</td>
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
              <td colSpan="9" className="text-end fw-bold">Total:</td>
              <td className="fw-bold" colSpan="2">{formatMoney(totalItems)}</td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}