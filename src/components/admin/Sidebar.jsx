import {
    faHouse,
    faBox,
    faLayerGroup,
    faPalette,
    faRulerCombined,
    faUsers,
    faClipboardList,
    faReceipt,
    faWandMagicSparkles,
    faTags,
    faMoneyBillWave,
    faXmark
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SidebarItem from "./SidebarItem";
import "../../assets/css/Sidebar.css";

export default function Sidebar({ isOpen, onClose }) {
   return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? "active" : ""}`} 
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
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
            end
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
            to="/admin/producciones"
            icon={faMoneyBillWave}
            text="Producciones"
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
            to="/admin/personalizaciones"
            icon={faWandMagicSparkles}
            text="Personalizaciones"
          />

          <SidebarItem
            to="/admin/ventas"
            icon={faMoneyBillWave}
            text="Ventas"
          />
        </div>
      </aside>
    </>
  );
};