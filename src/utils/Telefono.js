export const FORMATO_TELEFONO_VENEZOLANO = /^04\d{2}-\d{7}$/;

export const formatearTelefonoVenezolano = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits.length > 4
    ? `${digits.slice(0, 4)}-${digits.slice(4)}`
    : digits;
};
