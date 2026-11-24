import { useEffect, useState } from "react";
import api from "../../services/api";
import DataCardList from "../../components/common/DataCardList";

const notificationTypes = {
  pedido_web: "Pedido web",
  personalizaciones: "Personalización",
  producciones: "Producción"
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notificaciones/historial");
        if (active) setNotifications(data);
      } catch (requestError) {
        if (active) {
          setError(requestError.response?.data?.message || "No se pudieron cargar las notificaciones.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchNotifications();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-1">Notificaciones</h3>
      <p className="text-muted mb-4">Historial de eventos notificados en el sistema.</p>

      <div className="d-none d-lg-block">
        {loading && <p role="status">Cargando notificaciones...</p>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {!loading && !error && notifications.length === 0 && (
          <div className="alert alert-light border" role="status">
            Todavía no hay notificaciones.
          </div>
        )}
        {!loading && !error && notifications.length > 0 && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Fecha</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Notificación</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification) => (
                  <tr key={notification.id}>
                    <td>{new Date(notification.fecha).toLocaleString()}</td>
                    <td>{notificationTypes[notification.tipo] || notification.tipo}</td>
                    <td>{notification.mensaje}</td>
                    <td>
                      <span className={`badge ${notification.enviado ? "bg-secondary" : "bg-warning text-dark"}`}>
                        {notification.enviado ? "Notificada" : "Pendiente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="d-block d-lg-none">
        <DataCardList
          data={notifications}
          loading={loading}
          error={error}
          emptyMessage="Todavía no hay notificaciones."
          renderCard={(notification) => (
            <>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="mb-1 fw-bold text-dark">
                  {notificationTypes[notification.tipo] || notification.tipo}
                </h5>
                <span className={`badge ${notification.enviado ? "bg-secondary" : "bg-warning text-dark"}`}>
                  {notification.enviado ? "Notificada" : "Pendiente"}
                </span>
              </div>
              <p className="mb-2">{notification.mensaje}</p>
              <small className="text-muted">{new Date(notification.fecha).toLocaleString()}</small>
            </>
          )}
        />
      </div>
    </div>
  );
}
