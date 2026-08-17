import {
    faDollarSign,
    faClipboardList,
    faShirt,
    faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";

import DashboardCard from "./DashboardCard";
import { useGetFetch } from "../../hooks/useGetFetch";

export default function DashboardCards() {
    const { data: pedidos = [], loading, error } = useGetFetch("/pedidos");
    const ESTADO_PAGO_PENDIENTE = 1;

    const { data: pagosPendientes = [] } = useGetFetch(`/pagos?estado_pago_id=${ESTADO_PAGO_PENDIENTE}`);

    const cards = [
        {
            title: "Ventas Hoy",
            value: "$ 1.250",
            icon: faDollarSign,
            color: "#17195A"
        },
        {
            title: "Pedidos",
            value: loading ? "..." : error ? "-" : String(pedidos.length),
            icon: faClipboardList,
            color: "#E5B83F"
        },
        {
            title: "En Producción",
            value: "7",
            icon: faShirt,
            color: "#3F51B5"
        },
        {
            title: "Pagos por confirmar",
            value: loading ? "..." : error ? "-" : String(pagosPendientes.length),
            icon: faMoneyBill,
            color: "#76756f"
        }
    ];

    return (
        <div className="row">
            {cards.map((card, index) => (
                <div key={index} className="col-lg-3 col-md-6 mb-4">
                    <DashboardCard {...card} />
                </div>
            ))}
        </div>
    );
}