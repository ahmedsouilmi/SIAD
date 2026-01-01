import axios from "axios";


const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // your FastAPI backend
});

// Add a request interceptor to attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 -> clear token and redirect to login
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      try {
        window.location.href = "/login";
      } catch (e) {
        // ignore in non-browser env
      }
    }
    return Promise.reject(error);
  }
);

export default api;
