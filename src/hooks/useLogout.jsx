import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../utlis/Tostify";

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