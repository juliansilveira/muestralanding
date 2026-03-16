import axios from "axios";

// Configuración base de la API
const api = axios.create({
  baseURL: "http://localhost:3010/api", // URL de tu backend
  timeout: 10000, // Tiempo máximo de espera
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Manejar token expirado o inválido
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      // Manejar suscripción vencida o trial expirado
      const codigoError = error.response.data?.codigoError;
      if (codigoError === 'SUSCRIPCION_VENCIDA' || codigoError === 'TRIAL_VENCIDO') {
        window.location.href = "/suscripcion";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
