import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

import "../../assets/css/AdminNav.css";

export default function AdminNavbar() {
  return (
    <header className="admin-navbar">

      <div className="admin-navbar-left">

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

        <div className="admin-user">

          <img
            src="https://i.pravatar.cc/100"
            alt="Administrador"
          />

          <div>

            <h6>Administrador</h6>

            <small>HolyHoly</small>

          </div>

        </div>

      </div>

    </header>
  );
};