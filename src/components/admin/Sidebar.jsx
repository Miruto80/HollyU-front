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
    faRightFromBracket,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SidebarItem from "./SidebarItem";
import "../../assets/css/Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
    return (

        <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

            <div className="sidebar-logo">

                <img
                    src="/images/logo-holyholy.png"
                    alt="HolyHoly"
                />

                <button
                    type="button"
                    className="sidebar-close"
                    onClick={onClose}
                    aria-label="Cerrar menú"
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

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

            </div>

            <div className="sidebar-footer">

                <Link
                    className="logout-button"
                    to="/login"
                >

                    <FontAwesomeIcon icon={faRightFromBracket} />

                    Cerrar sesión

                </Link>

            </div>

        </aside>

    );

};