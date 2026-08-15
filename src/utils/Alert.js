// src/utils/alert.js
import Swal from "sweetalert2";

export const confirmarAccion = async ({
  titulo = "¿Estás seguro?",
  texto = "Esta acción no se puede deshacer",
  confirmText = "Sí, continuar",
  cancelText = "Cancelar",
  icon = "warning"
}) => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#000",
    cancelButtonColor: "#6c757d"
  });

  return result.isConfirmed;
};

export const alertaExito = (titulo, texto = "") => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: "success",
    confirmButtonColor: "#000"
  });
};

export const alertaError = (titulo, texto = "") => {
  return Swal.fire({
    title: titulo,
    text: texto,
    icon: "error",
    confirmButtonColor: "#000"
  });
};