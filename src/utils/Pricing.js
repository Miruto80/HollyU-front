export const CANTIDAD_MINIMA_MAYOR = 12;

export const getUnitPrice = (item) => {
  const cantidad = Number(item.cantidad || 0);
  const precioMayor = Number(item.precio_mayor || 0);

  if (cantidad >= CANTIDAD_MINIMA_MAYOR && precioMayor > 0) {
    return precioMayor;
  }

  return Number(item.precio || 0);
};

export const esPrecioMayor = (item) => {
  const cantidad = Number(item.cantidad || 0);
  const precioMayor = Number(item.precio_mayor || 0);
  return cantidad >= CANTIDAD_MINIMA_MAYOR && precioMayor > 0;
};