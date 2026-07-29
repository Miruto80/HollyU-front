import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="productos" element={<Products />} />
      {/* Futuras rutas */}
      {/* <Route path="clientes" element={<Clientes />} /> */}
      {/* <Route path="pedidos" element={<Pedidos />} /> */}
    </Routes>
  );
}

export default AdminRoutes;