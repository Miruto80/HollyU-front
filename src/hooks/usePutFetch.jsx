import { useCallback, useState } from "react";
import api from "../services/api";

export const usePutFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // put can be called either as put(body) —> PUT endpoint with body
  // or put(id, body) —> PUT endpoint/id with body
  const put = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      const [maybeId, maybeBody] = args.length === 1 ? [null, args[0]] : [args[0], args[1]];
      const url = maybeId ? `${endpoint}/${maybeId}` : endpoint;

      try {
        const response = await api.put(url, maybeBody);
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
