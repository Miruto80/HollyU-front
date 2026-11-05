import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import {
  faBars,
  faBell,
  faSearch,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/css/AdminNav.css";

export default function AdminNavbar({ onToggleSidebar }) {
   const handleLogout = useLogout();
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-left">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Alternar barra lateral"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className="admin-navbar-right">
        <Link
          to="/admin/notificaciones"
          className="icon-button d-flex align-items-center justify-content-center text-decoration-none text-reset"
          aria-label="Ver notificaciones"
          title="Ver notificaciones"
        >
          <FontAwesomeIcon icon={faBell} />
        </Link>

        <button 
          type="button"
          onClick={handleLogout}
          className="btn btn-logout d-flex align-items-center"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
        
          <span>Cerrar</span>
          <span className="d-none d-sm-inline ms-1">sesión</span>
        </button>
      </div>
    </header>
  );
};