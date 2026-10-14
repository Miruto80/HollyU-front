import { useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const POLL_INTERVAL = 15000;

export const useNotifications = (tipo) => {
  useEffect(() => {
    let active = true;
    let polling = false;

    const fetchNotifications = async () => {
      if (!active || polling) return;
      polling = true;

      try {
        const { data: notifications } = await api.get('/notificaciones', {
          params: { tipo }
        });

        if (notifications.length === 0) return;

        await api.patch('/notificaciones/enviadas', {
          ids: notifications.map(({ id }) => id)
        });

        notifications.forEach(({ id, mensaje }) => {
          toast.info(mensaje, {
            position: 'top-right',
            autoClose: 6000,
            toastId: `notificacion-${id}`
          });
        });
      } catch (error) {
        console.error('Error al consultar notificaciones:', error);
      } finally {
        polling = false;
      }
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, POLL_INTERVAL);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [tipo]);
};
