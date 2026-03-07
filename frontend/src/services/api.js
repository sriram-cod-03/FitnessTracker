import axios from "axios";
/*Create an Axios instance with the base backend URL. The baseURL matches your deployment on Render.*/
const api = axios.create({
  baseURL: "https://fitnesstracker-0a0d.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/*REQUEST INTERCEPTOR Automatically attaches the JWT token to every outgoing request. This fixes the "401 (Unauthorized)" errors seen in your logs. */
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

/*RESPONSE INTERCEPTOR Intercepts responses to handle specific error codes globally.*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server returns 401, the token is likely expired or invalid.
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Redirecting to login...");
      localStorage.removeItem("token");
      // Redirecting to login prevents the "loading on the same page" loop.
      window.location.href = "/login"; 
    }
    // Handle 404 errors silently or with custom logic if needed.
    return Promise.reject(error);
  }
);

export default api;