import axios from "axios";

const apiClient = axios.create({ baseURL: "/api" });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const extractErrorMessage = (error) =>
  error.response?.data?.message || "Une erreur est survenue. Réessayez.";

export default apiClient;
