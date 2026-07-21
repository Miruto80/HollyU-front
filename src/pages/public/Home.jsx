import React from 'react'
import { useState, useEffect } from 'react';
import { getColores } from '../../services/colores.service.js';

export default function Home() {
  const [colores, setColores] = useState([]);

  useEffect(() => {
    const fetchColores = async () => {
      try {
        const response = await getColores();
        setColores(response);
      } catch (error) {
        console.error('Error fetching colores:', error);
      }
    };

    fetchColores();
  }, []);
  return (
    <div>
      <h1>Colores</h1>
      <ul>
        {colores.map((color) => (
          <li key={color.id}> {color.nombre} {color.codigo_hex}</li>
        ))}
      </ul>
    </div>
  )
}
