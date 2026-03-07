import axios from "axios";

const api = axios.create({
  baseURL: "https://fitnesstracker-0a0d.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Attach token to fix 401 Unauthorized errors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Redirect to login only if the session expires
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