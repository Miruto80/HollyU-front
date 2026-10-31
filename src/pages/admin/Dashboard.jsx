import DashboardCards from "../../components/admin/DashboardCards";
import ProductionTable from "../../components/admin/ProductionTable";
import SalesChart from "../../components/admin/SalesChart";

import "../../assets/css/Dashboard.css";

export default function Dashboard (){
return (
    <div className="container-fluid px-2 px-md-2 px-lg-2 py-2">
      
      {/* CARD BIENVENIDA */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 text-white overflow-hidden" style={{ backgroundColor: "#17195A" }}>
        <div className="card-body p-2 p-md-4">
          <div className="row align-items-center">
            
            <div className="col-12 col-md-8 text-center text-md-start">
              <span className="d-block small mb-2 fw-medium" style={{ color: "#E5B83F" }}>
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <h3 className="fw-bold mb-2">¡Bienvenido de nuevo!</h3>
              <p className="text-white-50 mb-2">Mantén el control y revisa la actividad actual</p>
            </div>

            <div className="col-md-4 d-none d-md-flex justify-content-end align-items-center">
              <div className="fs-1 text-white opacity-50">
                <i className="bi bi-speedometer2"></i>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS  */}
      <DashboardCards />

      {/* SECCIÓN DE TABLA Y GRÁFICA */}
      <div className="row mt-4">
        
        <div className="col-lg-7 mb-4 mb-lg-0">
          <ProductionTable />
        </div>

        <div className="col-lg-5">
          <SalesChart />
        </div>
      </div>

    </div>
  );
};
