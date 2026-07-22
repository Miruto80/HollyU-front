import { useCallback, useState } from "react";
import api from "../services/api";

export const usePutFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const put = useCallback(
    async (body) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.put(endpoint, body);
        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { data, loading, error, put };
};
