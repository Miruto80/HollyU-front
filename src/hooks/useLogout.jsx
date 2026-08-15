import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../utils/Tostify";

export const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    notifySuccess("Sesión cerrada correctamente");
    navigate("/login", { replace: true });
  };
};