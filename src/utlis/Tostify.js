import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifySuccess = (mensaje) => {
  toast.success(mensaje, { position: "top-right", autoClose: 3000 });
};

export const notifyError = (mensaje) => {
  toast.error(mensaje, { position: "top-right", autoClose: 4000 });
};

export const notifyInfo = (mensaje) => {
  toast.info(mensaje, { position: "top-right", autoClose: 3000 });
};