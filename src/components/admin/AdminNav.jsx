import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="search-box">

          <FontAwesomeIcon
            icon={faSearch}
            className="search-icon"
          />

          <input
            type="text"
            placeholder="Buscar..."
          />

        </div>

      </div>

      <div className="admin-navbar-right">

        <button className="icon-button">

          <FontAwesomeIcon icon={faBell} />

          <span className="notification-badge">
            3
          </span>

        </button>

        <button 
        type="button"
        onClick={handleLogout}
        className="btn btn-logout d-flex align-items-center">
          <FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
          Cerrar sesión
        </button>

      </div>

    </header>
  );
};