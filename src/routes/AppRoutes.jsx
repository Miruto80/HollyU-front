import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Home from "../pages/public/Home.jsx";
import Login from "../pages/public/Login.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import AdminRoutes from "./AdminRoutes.jsx";
import Catalog from "../pages/public/Catalog.jsx";
import ProtectRoute from "./ProtectRoute.jsx";
import Checkout from "../pages/public/Checkout.jsx";
import OrderConfirmation from "../pages/public/OrderConfirmation.jsx";
import MyOrders from "../pages/public/MyOrders.jsx";
import CartPage from "../pages/public/CartPage.jsx";
import DeliveryPage from "../pages/public/DeliveryPage.jsx";
import Terms from "../components/catalog/Terms.jsx";
import NotFound from "../pages/NotFound.jsx";
import FadeWrapper from "../components/animations/FadeWrapper.jsx";

const withFade = (page) => <FadeWrapper>{page}</FadeWrapper>;

function AppRoutes() {
  const location = useLocation();

  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  return (
    <>
      <ScrollToTop />

  
      {!isAdminRoute && <Navbar />}

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={`${location.pathname}${location.search}`}>
          <Route path="/" element={withFade(<Home />)} />
          <Route path="/login" element={withFade(<Login />)} />
          <Route path="/catalog" element={withFade(<Catalog />)} />
          <Route path="/catalog/:category" element={withFade(<Catalog />)} />
          <Route path="/cart" element={withFade(<CartPage />)} />
          <Route path="/entrega" element={withFade(<DeliveryPage />)} />
          <Route path="/checkout" element={withFade(<Checkout />)} />
          <Route path="/pedido-confirmado/:id" element={withFade(<OrderConfirmation />)} />
          <Route path="/mis-pedidos" element={withFade(<MyOrders />)} />


          <Route
            path="/admin/*"
            element={withFade(
              <ProtectRoute rolPermitido="Administrador">
                <AdminRoutes />
              </ProtectRoute>
            )}
          />
          <Route path="*" element={withFade(<NotFound />)} />
        </Routes>
      </AnimatePresence>

      {!isAdminRoute && <Footer />}
      <Terms />
    </>
  );
}

export default AppRoutes;