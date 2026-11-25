import { roundCurrency } from "./Pricing.js";

export const getDiscountForProduct = (product, descuentos = [], unitPrice = Number(product.precio || 0)) => {
  const now = new Date();
  const productId = product.producto_id ?? product.id;
  const categoryId = product.categoria_id ?? product.Categoria?.id;
  const listaDescuentos = Array.isArray(descuentos) ? descuentos : [];

  const aplicable = listaDescuentos.find((descuento) => {
    if (!descuento.activo) return false;

    const fechaInicio = descuento.fecha_inicio ? new Date(descuento.fecha_inicio) : null;
    const fechaFin = descuento.fecha_fin ? new Date(descuento.fecha_fin) : null;

    if (fechaInicio && now < fechaInicio) return false;
    if (fechaFin && now > fechaFin) return false;

    const categoryMatch =
      descuento.categoria_id != null &&
      categoryId != null &&
      Number(descuento.categoria_id) === Number(categoryId);
    const productMatch =
      Array.isArray(descuento.Productos) &&
      descuento.Productos.some((item) => Number(item.id) === Number(productId));

    return categoryMatch || productMatch;
  });

  if (!aplicable) return null;

  const valor = Math.max(0, Number(aplicable.valor || 0));
  const esPorcentaje = aplicable.Tipos_descuento?.nombre === "Porcentaje";
  const rawAmount = esPorcentaje ? unitPrice * (valor / 100) : valor;
  const amountPerUnit = Math.min(Math.max(0, roundCurrency(unitPrice)), roundCurrency(rawAmount));
  if (amountPerUnit <= 0) return null;

  return {
    amountPerUnit,
    badge: esPorcentaje ? `${valor.toLocaleString()}%` : `$${amountPerUnit.toLocaleString()}`,
    label: esPorcentaje ? `${valor.toFixed(2)}% de descuento` : `$${amountPerUnit.toLocaleString()} de descuento`
  };
};

export const getDiscountedItemPricing = (product, descuentos, quantity, unitPrice) => {
  const precioUnitario = Math.max(0, roundCurrency(unitPrice));
  const cantidad = Math.max(0, Number(quantity) || 0);
  const discountInfo = getDiscountForProduct(product, descuentos, precioUnitario);
  const discountPerUnit = discountInfo?.amountPerUnit || 0;
  const discountedUnitPrice = roundCurrency(Math.max(0, precioUnitario - discountPerUnit));
  const subtotal = roundCurrency(precioUnitario * cantidad);
  const discountedSubtotal = roundCurrency(discountedUnitPrice * cantidad);

  return {
    unitPrice: precioUnitario,
    discountInfo,
    discountPerUnit,
    discountAmount: roundCurrency(subtotal - discountedSubtotal),
    discountedUnitPrice,
    subtotal,
    discountedSubtotal
  };
};
