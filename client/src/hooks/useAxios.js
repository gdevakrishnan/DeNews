import { useState } from 'react';
import axios from 'axios';

const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base Axios instance (declare baseURL here)
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Generic request handler
  const request = async (method, url, data = {}, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Prebuilt methods for convenience
  const api = {
    get: (url, config) => request('get', url, {}, config),
    post: (url, data, config) => request('post', url, data, config),
    put: (url, data, config) => request('put', url, data, config),
    delete: (url, config) => request('delete', url, {}, config),
    patch: (url, data, config) => request('patch', url, data, config),
  };

  return { api, loading, error };
};

export default useAxios;
