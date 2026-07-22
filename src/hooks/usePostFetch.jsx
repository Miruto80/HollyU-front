import { useCallback, useState } from "react";
import api from "../services/api";

export const usePostFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = useCallback(
    async (body) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.post(endpoint, body);
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

  return { data, loading, error, post };
};
