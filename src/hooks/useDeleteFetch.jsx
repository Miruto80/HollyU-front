import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

export const useDeleteFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setPendingAction(null);
  }, []);

  const remove = useCallback(
    (id) => {
      return new Promise((resolve, reject) => {
        setPendingAction({ id, resolve, reject });
        setShowModal(true);
      });
    },
    []
  );

  const confirmDelete = useCallback(async () => {
    if (!pendingAction?.id) return null;

    setLoading(true);
    setError(null);
    setShowModal(false);

    try {
      const response = await api.delete(`${endpoint}/${pendingAction.id}`);
      setData(response.data);
      toast.success("¡Solicitud eliminada con éxito!");
      pendingAction.resolve(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      toast.error("Error al enviar la solicitud");
      pendingAction.reject(err);
      throw err;
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  }, [endpoint, pendingAction]);

  const cancelDelete = useCallback(() => {
    if (pendingAction?.reject) {
      pendingAction.reject(new Error("Eliminación cancelada"));
    }
    toast.info("Eliminación cancelada");
    closeModal();
  }, [closeModal, pendingAction]);

  const DeleteModal = ({ title = "Confirmación", message = "¿Estás seguro de que deseas eliminar este elemento?" } = {}) => (
    <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" style={{ backgroundColor: showModal ? "rgba(0, 0, 0, 0.5)" : "transparent" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={cancelDelete}></button>
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return { data, loading, error, remove, confirmDelete, cancelDelete, showModal, DeleteModal };
};
