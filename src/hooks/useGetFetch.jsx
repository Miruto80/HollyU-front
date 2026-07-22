import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export const useFetchData = (fetcher, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return { data, loading, error, refetch: fetchData };
};

export const useGetFetch = (endpoint, dependencies = []) => {
  const fetcher = useCallback(() => api.get(endpoint).then((response) => response.data), [endpoint]);

  return useFetchData(fetcher, dependencies);
};
