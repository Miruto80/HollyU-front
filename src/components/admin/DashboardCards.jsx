import {
    faDollarSign,
    faClipboardList,
    faShirt,
    faUsers
} from "@fortawesome/free-solid-svg-icons";

import DashboardCard from "./DashboardCard";

export default function Sidebar() {

    const cards = [

        {
            title: "Ventas Hoy",
            value: "$ 1.250",
            icon: faDollarSign,
            color: "#17195A"
        },

        {
            title: "Pedidos",
            value: "18",
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
            title: "Clientes",
            value: "250",
            icon: faUsers,
            color: "#4CAF50"
        }

    ];

    return (

        <div className="row">

            {cards.map((card, index) => (

                <div
                    key={index}
                    className="col-lg-3 col-md-6 mb-4"
                >

                    <DashboardCard {...card} />

                </div>

            ))}

        </div>

    );

};