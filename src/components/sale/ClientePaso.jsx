import { useState } from "react";
import api from "../../services/api";
import { notifyError } from "../../utils/Tostify";

export default function ClientePaso({ cliente, onSelectCliente }) {
  const [documento, setDocumento] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [noEncontrado, setNoEncontrado] = useState(false);
  const [datosNuevo, setDatosNuevo] = useState({
    nombres: "", apellidos: "", documento: "", telefono: "", email: ""
  });

  const buscarCliente = async () => {
    if (!documento.trim()) return;
    setBuscando(true);
    setNoEncontrado(false);

    try {
      const { data: clientes } = await api.get("/clientes");
      const encontrado = clientes.find(c => c.documento === documento.trim());

      if (encontrado) {
        onSelectCliente(encontrado);
      } else {
        setNoEncontrado(true);
        setDatosNuevo(prev => ({ ...prev, documento }));
      }
    } catch {
      notifyError("Error al buscar el cliente");
    } finally {
      setBuscando(false);
    }
  };

  const crearCliente = async () => {
    if (!datosNuevo.nombres || !datosNuevo.email) {
      notifyError("Completa al menos nombre y email");
      return;
    }

    try {
      const { data: nuevo } = await api.post("/clientes/buscar-o-crear", {
        ...datosNuevo,
        tipo_cliente_id: 1
      });
      onSelectCliente(nuevo);
    } catch {
      notifyError("No se pudo registrar el cliente");
    }
  };

  if (cliente) {
    return (
      <div className="alert alert-success d-flex justify-content-between align-items-center">
        <div>
          <strong>{cliente.nombres} {cliente.apellidos}</strong> — {cliente.documento || cliente.email}
        </div>
        <button className="btn btn-sm btn-outline-dark" onClick={() => onSelectCliente(null)}>
          Cambiar cliente
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="form-label">Buscar por documento</label>
      <div className="input-group mb-3">
        <input
          className="form-control"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          placeholder="Cédula del cliente"
        />
        <button className="btn btn-dark" onClick={buscarCliente} disabled={buscando}>
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {noEncontrado && (
        <div className="border rounded p-3">
          <p className="text-muted">Cliente no encontrado, complete sus datos:</p>
          <div className="row g-2">
            <div className="col-md-6">
              <input className="form-control" placeholder="Nombres"
                value={datosNuevo.nombres}
                onChange={(e) => setDatosNuevo(p => ({ ...p, nombres: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Apellidos"
                value={datosNuevo.apellidos}
                onChange={(e) => setDatosNuevo(p => ({ ...p, apellidos: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Teléfono"
                value={datosNuevo.telefono}
                onChange={(e) => setDatosNuevo(p => ({ ...p, telefono: e.target.value }))} />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Email" type="email"
                value={datosNuevo.email}
                onChange={(e) => setDatosNuevo(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
          <button className="btn btn-dark mt-3" onClick={crearCliente}>
            Registrar cliente
          </button>
        </div>
      )}
    </div>
  );
}