import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../utils/Tostify";
import { useCart } from "./useCart";

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  return () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    clearCart();
    notifySuccess("Sesión cerrada correctamente");
    navigate("/login", { replace: true });
  };
};