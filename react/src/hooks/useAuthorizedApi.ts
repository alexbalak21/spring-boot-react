// hooks/useAuthorizedApi.ts
import axios from "axios";

export function useAuthorizedApi() {
  const api = axios.create({
    baseURL: "/api",
  });

  // Always read the latest token from localStorage
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return api;
}
