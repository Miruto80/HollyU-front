import DashboardCards from "../../components/admin/DashboardCards";
import ProductionTable from "../../components/admin/ProductionTable";
import SalesChart from "../../components/admin/SalesChart";

import "../../assets/css/Dashboard.css";

export default function Dashboard (){
  return (
                <div className="container-fluid py-4">

                    <DashboardCards />

                    <div className="row mt-4">

                        <div className="col-lg-7">

                            <ProductionTable />

                        </div>

                        <div className="col-lg-5">

                            <SalesChart />

                        </div>

                    </div>

                </div>
    );
};
