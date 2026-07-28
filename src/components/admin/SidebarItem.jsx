import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarItem = ({ to, icon, text }) => {

    return (

        <NavLink
            to={to}
            className="sidebar-item"
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