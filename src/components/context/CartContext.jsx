import { useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext.js";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("carrito");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  const addItem = (producto, cantidad = 1) => {
    setItems(prev => {
      const existente = prev.find(i => i.id === producto.id);
      if (existente) {
        return prev.map(i =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, cantidad } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const totalPrecio = items.reduce((sum, i) => sum + i.cantidad * Number(i.precio ?? 0), 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateCantidad, clearCart, totalItems, totalPrecio }}
    >
      {children}
    </CartContext.Provider>
  );
}