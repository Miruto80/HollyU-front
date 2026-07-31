// src/services/productos.service.js
import api, { API_URL } from "./api"; // Importas api y la URL base

// Función auxiliar para formatear las rutas de las imágenes
const formatProductImage = (producto) => {
  if (!producto) return producto;

  // Formateamos el array de imágenes si existe
  const imagenesFormateadas = producto.Producto_imagenes?.map((img) => ({
    ...img,
    // Si la imagen existe y no empieza con http, le anteponemos la API_URL
    imagen: img.imagen && !img.imagen.startsWith("http")
      ? `${API_URL}${img.imagen}`
      : img.imagen
  }));

  return {
    ...producto,
    Producto_imagenes: imagenesFormateadas
  };
};

export const getProductos = async () => {
  const response = await api.get("/productos");
  // Mapeamos todo el listado de productos
  return response.data.map(formatProductImage);
};

export const getProductoById = async (id) => {
  const response = await api.get(`/productos/${id}`);
  // Mapeamos solo el producto obtenido
  return formatProductImage(response.data);
};