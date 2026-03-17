import axios from "axios";

const api = axios.create({
  // baseURL must match your Render backend exactly
  baseURL: "https://fitnesstracker-0a0d.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ ATTACH TOKEN: Uses your logic to fix 401 Unauthorized errors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ AUTO-LOGOUT: Redirects if token is invalid or expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;