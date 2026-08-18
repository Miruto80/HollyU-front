import { Routes, Route } from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout.jsx";

import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Categories from "../pages/admin/Categories";
import Clients from "../pages/admin/Clients";
import Orders from "../pages/admin/Orders";
import Sizes from "../pages/admin/Sizes";
import Colors from "../pages/admin/Colors";

function AdminRoutes() {

    return (

        <Routes>

            <Route element={<AdminLayout />}>

                <Route path="/" element={<Dashboard />} />

                <Route path="productos" element={<Products />} />

                 <Route path="categorias" element={<Categories />} /> 

                <Route path="clientes" element={<Clients />} /> 

                <Route path="pedidos" element={<Orders />} />

                <Route path="tallas" element={<Sizes />} />

                <Route path="colores" element={<Colors />} />

            </Route>

        </Routes>

    );

}

export default AdminRoutes;