import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashboardCard({ title, value, icon, color }) {

    return (

        <div className="dashboard-card">

            <div
                className="dashboard-icon"
                style={{
                    background: color
                }}
            >

                <FontAwesomeIcon icon={icon} />

            </div>

            <div>

                <h3>{value}</h3>

                <span>{title}</span>

            </div>

        </div>

    );

};