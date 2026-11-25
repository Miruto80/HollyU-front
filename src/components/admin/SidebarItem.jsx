import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarItem = ({ to, icon, text, end = false }) => {

    return (

        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-item${isActive ? " active" : ""}`}
        >

            <FontAwesomeIcon
                icon={icon}
                className="sidebar-icon"
            />

            <span>

                {text}

            </span>

        </NavLink>

    );

};

export default SidebarItem;