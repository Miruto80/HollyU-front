import { Link } from "react-router-dom";
import { useGetFetch } from "../../hooks/useGetFetch";

export default function MyOrders() {
  const { data: cliente, loading: loadingCliente, error: errorCliente } = useGetFetch("/clientes/me");
  const clienteId = cliente?.id;
  const { data: pedidosData, loading: loadingPedidos, error: errorPedidos } = useGetFetch(
    clienteId ? `/clientes/${clienteId}/pedidos` : null
  );
  const pedidos = pedidosData || [];

  if (loadingCliente || loadingPedidos) {
    return <main className="container py-5"><p>Cargando tus pedidos...</p></main>;
  }

  if (errorCliente || errorPedidos) {
    return (
      <main className="container py-5">
        <h1>Mis pedidos</h1>
        <p className="text-muted">No pudimos cargar tus pedidos.</p>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4">Mis pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="text-muted">Todavía no tienes pedidos.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>#{pedido.id}</td>
                  <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                  <td>{pedido.Estados_pedido?.nombre ?? "-"}</td>
                  <td>{Number(pedido.total || 0).toLocaleString()} $</td>
                  <td>
                    <Link to={`/pedido-confirmado/${pedido.id}`} className="btn btn-sm btn-outline-primary">
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}