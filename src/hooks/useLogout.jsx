import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("usuario");
    navigate("/login", { replace: true });
  };
};