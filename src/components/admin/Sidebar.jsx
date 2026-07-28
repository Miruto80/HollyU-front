import { Link } from "react-router-dom";
import {
    faHouse,
    faBox,
    faLayerGroup,
    faPalette,
    faRulerCombined,
    faUsers,
    faClipboardList,
    faReceipt,
    faTags,
    faMoneyBillWave,
    faBell,
    faGear
} from "@fortawesome/free-solid-svg-icons";

import SidebarItem from "./SidebarItem";
import "../../assets/css/Sidebar.css";

export default function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">

                <img
                    src="/images/logo-holyholy.png"
                    alt="HolyHoly"
                />

            </div>

            <div className="sidebar-menu">

                <SidebarItem
                    to="/admin"
                    icon={faHouse}
                    text="Dashboard"
                />

                <SidebarItem
                    to="/admin/productos"
                    icon={faBox}
                    text="Productos"
                />

                <SidebarItem
                    to="/admin/categorias"
                    icon={faLayerGroup}
                    text="Categorías"
                />

                <SidebarItem
                    to="/admin/colores"
                    icon={faPalette}
                    text="Colores"
                />

                <SidebarItem
                    to="/admin/tallas"
                    icon={faRulerCombined}
                    text="Tallas"
                />

                <SidebarItem
                    to="/admin/clientes"
                    icon={faUsers}
                    text="Clientes"
                />

                <SidebarItem
                    to="/admin/pedidos"
                    icon={faClipboardList}
                    text="Pedidos"
                />

                <SidebarItem
                    to="/admin/pagos"
                    icon={faMoneyBillWave}
                    text="Pagos"
                />

                <SidebarItem
                    to="/admin/descuentos"
                    icon={faTags}
                    text="Descuentos"
                />

                <SidebarItem
                    to="/admin/cotizaciones"
                    icon={faReceipt}
                    text="Cotizaciones"
                />

                <SidebarItem
                    to="/admin/notificaciones"
                    icon={faBell}
                    text="Notificaciones"
                />

                <SidebarItem
                    to="/admin/configuracion"
                    icon={faGear}
                    text="Configuración"
                />

            </div>

            <div className="sidebar-footer">

                <Link
                    className="logout-button"
                    to="/login"
                >

                    <i>
                        <faRightFromBracket />
                    </i>

                    Cerrar sesión

                </Link>

            </div>

        </aside>

    );

};