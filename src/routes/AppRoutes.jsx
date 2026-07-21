import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Home from "../pages/public/Home.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";


function AppRoutes() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default AppRoutes;