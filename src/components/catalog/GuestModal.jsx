import { useState } from "react";
import { usePostFetch } from "../../hooks/usePostFetch";
import { notifyError } from "../../utils/Tostify";

const TIPO_CLIENTE_PARTICULAR = 1;

export default function GuestDataModal({ show, onConfirm, onClose }) {
  const { post, loading } = usePostFetch("/clientes/buscar-o-crear");

  const [datos, setDatos] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    telefono: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!datos.nombres || !datos.email) {
      notifyError("Completa al menos tu nombre y email");
      return;
    }

    try {
      const cliente = await post({
        ...datos,
        tipo_cliente_id: TIPO_CLIENTE_PARTICULAR
      });
      onConfirm(cliente);
    } catch {
      notifyError("No se pudo registrar tus datos, intenta de nuevo");
    }
  };

  if (!show) return null;

  return (
    <div className="product-modal">
      <div className="product-modal-dialog" style={{ maxWidth: 500 }}>
        <div className="product-modal-content">

          <div className="product-modal-header">
            <h5 className="product-modal-title">Completa tus datos</h5>
            {onClose && (
              <button
                type="button"
                className="product-modal-close"
                onClick={onClose}
                aria-label="Cerrar"
              >
                ×
              </button>
            )}
          </div>

          <div className="product-modal-body">
            <p className="text-muted mb-4">
              Necesitamos estos datos para procesar tu pedido.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombres</label>
                  <input
                    type="text"
                    name="nombres"
                    className="form-control"
                    value={datos.nombres}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Apellidos</label>
                  <input
                    type="text"
                    name="apellidos"
                    className="form-control"
                    value={datos.apellidos}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Documento</label>
                  <input
                    type="text"
                    name="documento"
                    className="form-control"
                    value={datos.documento}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    className="form-control"
                    value={datos.telefono}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={datos.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 mt-4 py-2"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Continuar"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}