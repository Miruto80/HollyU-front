export async function obtenerTasaDolar() {
  try {
    const respuesta = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const tasa = Number(datos.promedio);
    if (!Number.isFinite(tasa) || tasa <= 0) {
      throw new Error('La tasa recibida no es válida');
    }

    return tasa;
  } catch (error) {
    console.error('Error al obtener la tasa del dólar:', error);
    return null;
  }
}