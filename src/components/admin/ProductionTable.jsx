import { useGetFetch } from "../../hooks/useGetFetch";
import DataCardList from "../common/DataCardList";

export default function ProductionTable() {
    const { data: producciones = [], loading, error } = useGetFetch("/producciones");
    const pedidosEnProduccion = producciones
        .filter((produccion) => produccion.Estados_produccion?.nombre !== "Terminado")
        .slice(0, 5);

    return (
        <div className="card dashboard-table">
            <div className="card-body">
                <h5>
                    Pedidos en Producción
                </h5>
                <div className="d-none d-lg-block">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Entrega</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4">Cargando...</td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4">No se pudieron cargar los pedidos</td>
                                </tr>
                            ) : pedidosEnProduccion.length === 0 ? (
                                <tr>
                                    <td colSpan="4">No hay pedidos en producción</td>
                                </tr>
                            ) : pedidosEnProduccion.map((produccion) => (
                                <tr key={produccion.id}>
                                    <td>#{produccion.Pedido?.id ?? "-"}</td>
                                    <td>
                                        {produccion.Pedido?.Cliente
                                            ? `${produccion.Pedido.Cliente.nombres} ${produccion.Pedido.Cliente.apellidos ?? ""}`
                                            : "-"}
                                    </td>
                                    <td>
                                        <span className="badge bg-warning text-dark">
                                            {produccion.Estados_produccion?.nombre ?? "-"}
                                        </span>
                                    </td>
                                    <td>
                                        {produccion.Pedido?.fecha_entrega_estimada
                                            ? new Date(produccion.Pedido.fecha_entrega_estimada).toLocaleDateString()
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-block d-lg-none">
                    <DataCardList
                        data={pedidosEnProduccion}
                        loading={loading}
                        error={error}
                        emptyMessage="No hay pedidos en producción"
                        renderCard={(produccion) => (
                            <>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="mb-1 fw-bold text-dark">
                                        Pedido #{produccion.Pedido?.id ?? "-"}
                                    </h6>
                                    <span className="badge bg-warning text-dark">
                                        {produccion.Estados_produccion?.nombre ?? "-"}
                                    </span>
                                </div>
                                <div className="row small text-muted g-2">
                                    <div className="col-12">
                                        <strong>Cliente:</strong> {produccion.Pedido?.Cliente
                                            ? `${produccion.Pedido.Cliente.nombres} ${produccion.Pedido.Cliente.apellidos ?? ""}`
                                            : "-"}
                                    </div>
                                    <div className="col-12">
                                        <strong>Entrega:</strong> {produccion.Pedido?.fecha_entrega_estimada
                                            ? new Date(produccion.Pedido.fecha_entrega_estimada).toLocaleDateString()
                                            : "-"}
                                    </div>
                                </div>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
