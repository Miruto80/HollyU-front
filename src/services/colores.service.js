import api from "./api";

export const getColores = async () => {
    const response = await api.get("/colores");
    return response.data;
};