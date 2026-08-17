import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout.jsx";

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Categories from "../pages/admin/Categories";
import Clients from "../pages/admin/Clients";
import Orders from "../pages/admin/Orders";

function AdminRoutes() {

    return (

        <Routes>

            <Route element={<AdminLayout />}>

                <Route path="/" element={<Dashboard />} />

                <Route path="productos" element={<Products />} />

                 <Route path="categorias" element={<Categories />} /> 

                <Route path="clientes" element={<Clients />} /> 

                <Route path="pedidos" element={<Orders />} />

            </Route>

        </Routes>

    );

}

export default AdminRoutes;