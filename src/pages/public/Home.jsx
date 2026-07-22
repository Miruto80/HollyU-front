import React from "react";
import { useFetchData } from "../../hooks/useGetFetch.jsx";
import { getColores } from "../../services/colores.service.js";

export default function Home() {
  const { data: colores, loading, error, refetch } = useFetchData(getColores);

  if (loading) {
    return <p>Cargando colores...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error al cargar los colores.</p>
        <button onClick={refetch}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Colores</h1>
      <button onClick={refetch}>Actualizar</button>
      <ul>
        {colores.map((color) => (
          <li key={color.id}>
            {color.nombre} - {color.codigo_hex}
          </li>
        ))}
      </ul>
    </div>
  );
}
