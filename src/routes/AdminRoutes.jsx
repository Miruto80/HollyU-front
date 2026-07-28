import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      {/* Futuras rutas */}
      {/* <Route path="productos" element={<Productos />} /> */}
      {/* <Route path="clientes" element={<Clientes />} /> */}
      {/* <Route path="pedidos" element={<Pedidos />} /> */}
    </Routes>
  );
}

export default AdminRoutes;