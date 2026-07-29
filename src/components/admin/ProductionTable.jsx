const pedidos = [

    {
        id: 1001,
        cliente: "Hospital Central",
        estado: "Corte",
        entrega: "20 Jul"
    },

    {
        id: 1002,
        cliente: "Colegio San José",
        estado: "Costura",
        entrega: "21 Jul"
    },

    {
        id: 1003,
        cliente: "María Pérez",
        estado: "Bordado",
        entrega: "22 Jul"
    },

    {
        id: 1004,
        cliente: "Clínica Norte",
        estado: "Empaque",
        entrega: "23 Jul"
    }

];

export default function ProductionTable() {

    return (

        <div className="card dashboard-table">

            <div className="card-body">

                <h5>

                    Pedidos en Producción

                </h5>

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

                        {

                            pedidos.map(pedido => (

                                <tr key={pedido.id}>

                                    <td>#{pedido.id}</td>

                                    <td>{pedido.cliente}</td>

                                    <td>

                                        <span className="badge bg-warning text-dark">

                                            {pedido.estado}

                                        </span>

                                    </td>

                                    <td>{pedido.entrega}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

};