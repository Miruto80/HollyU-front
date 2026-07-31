import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Home from "../pages/public/Home.jsx";
import Login from "../pages/public/Login.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import Catalog from "../pages/public/Catalog.jsx";

function AppRoutes() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:category" element={<Catalog />} />

        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default AppRoutes;