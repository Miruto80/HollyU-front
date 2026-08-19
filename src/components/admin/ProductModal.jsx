// src/pages/admin/ProductoModal.jsx
import { useState } from "react";
import { useGetFetch } from "../../hooks/useGetFetch";
import { usePostFetch } from "../../hooks/usePostFetch";
import ImageUploader from "../ImageUploader";

export default function ProductoModal({ show, onClose, onCreated }) {
  const { data: categorias } = useGetFetch("/categorias");
  const { data: generos } = useGetFetch("/generos");
  const { data: tiposTela } = useGetFetch("/tipos_tela");
  const { data: colores } = useGetFetch("/colores");
  const { data: tallas } = useGetFetch("/tallas");

  const { post, loading, error } = usePostFetch("/productos");

  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria_id: "",
    genero_id: "",
    precio: "",
    precio_mayor: "",
    stock: 0,
    permite_personalizacion: true,
    tiempo_fabricacion: 7
  });

  const [modelo, setModelo] = useState({
    nombre: "",
    descripcion: "",
    tipo_tela_id: "",
    precio: "",
    precio_mayor: "",
    colores: [],
    tallas: []
  });

  const [imagen, setImagen] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleMulti = (field, id) => {
    setModelo(prev => {
      const exists = prev[field].includes(id);
      return {
        ...prev,
        [field]: exists ? prev[field].filter(x => x !== id) : [...prev[field], id]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const modelosPayload = [
      {
        nombre: modelo.nombre,
        descripcion: modelo.descripcion,
        telas: [
          {
            tipo_tela_id: modelo.tipo_tela_id,
            precio: modelo.precio,
            precio_mayor: modelo.precio_mayor,
            colores: modelo.colores
          }
        ],
        tallas: modelo.tallas
      }
    ];

    const formData = new FormData();
    formData.append("codigo", form.codigo);
    formData.append("nombre", form.nombre);
    formData.append("descripcion", form.descripcion);
    formData.append("categoria_id", form.categoria_id);
    formData.append("genero_id", form.genero_id);
    formData.append("precio", form.precio);
    formData.append("precio_mayor", form.precio_mayor);
    formData.append("stock", form.stock);
    formData.append("permite_personalizacion", form.permite_personalizacion);
    formData.append("tiempo_fabricacion", form.tiempo_fabricacion);
    formData.append("modelos", JSON.stringify(modelosPayload));

    // nombreArchivo debe ir ANTES que imagen para que multer lo lea a tiempo
    if (imagen) {
      const extension = imagen.name.split('.').pop();
      formData.append("nombreArchivo", `${form.codigo}_${Date.now()}.${extension}`);
      formData.append("imagen", imagen);
    }

    try {
      await post(formData);
      onCreated?.();
      onClose();
    } catch {
      // el error ya está en el estado del hook
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Registrar producto</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  {error.response?.data?.message || "Error al crear el producto"}
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Código</label>
                  <input name="codigo" className="form-control" value={form.codigo} onChange={handleChange} required />
                </div>

                <div className="col-md-8">
                  <label className="form-label">Nombre</label>
                  <input name="nombre" className="form-control" value={form.nombre} onChange={handleChange} required />
                </div>

                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Categoría</label>
                  <select name="categoria_id" className="form-select" value={form.categoria_id} onChange={handleChange} required>
                    <option value="">Seleccione...</option>
                    {categorias?.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Género</label>
                  <select name="genero_id" className="form-select" value={form.genero_id} onChange={handleChange}>
                    <option value="">Seleccione...</option>
                    {generos?.map(g => (
                      <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Tiempo de fabricación (días)</label>
                  <input
                    type="number"
                    name="tiempo_fabricacion"
                    className="form-control"
                    value={form.tiempo_fabricacion}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                <label className="form-label">Stock</label>
                 <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  />
                 </div>
                <div className="col-md-6 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="permite_personalizacion"
                      name="permite_personalizacion"
                      checked={form.permite_personalizacion}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="permite_personalizacion">
                      Permite personalización
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Imagen principal</label>
                  <ImageUploader onImageSelected={setImagen} />
                </div>
              </div>

              <hr className="my-4" />
              <h6>Modelo inicial</h6>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del modelo</label>
                  <input
                    className="form-control"
                    value={modelo.nombre}
                    onChange={(e) => setModelo(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Tipo de tela</label>
                  <select
                    className="form-select"
                    value={modelo.tipo_tela_id}
                    onChange={(e) => setModelo(prev => ({ ...prev, tipo_tela_id: e.target.value }))}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {tiposTela?.map(t => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
  <label className="form-label">Precio base</label>
  <input
    type="number"
    name="precio"
    className="form-control"
    value={form.precio}
    onChange={handleChange}
    required
  />
</div>

<div className="col-md-6">
  <label className="form-label">Precio mayorista base</label>
  <input
    type="number"
    name="precio_mayor"
    className="form-control"
    value={form.precio_mayor}
    onChange={handleChange}
  />
</div>

                <div className="col-12">
                  <label className="form-label">Colores</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {colores?.map(c => (
                      <span
                        key={c.id}
                        onClick={() => toggleMulti("colores", c.id)}
                        style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: c.codigo_hex, cursor: "pointer",
                          border: modelo.colores.includes(c.id) ? "3px solid #000" : "1px solid #ccc"
                        }}
                        title={c.nombre}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label">Tallas</label>
                  <div className="d-flex gap-2 flex-wrap">
                    {tallas?.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        className={`btn btn-sm ${modelo.tallas.includes(t.id) ? "btn-dark" : "btn-outline-dark"}`}
                        onClick={() => toggleMulti("tallas", t.id)}
                      >
                        {t.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-dark" disabled={loading}>
                {loading ? "Guardando..." : "Registrar producto"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}