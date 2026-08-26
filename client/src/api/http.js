import axios from "axios";

export const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

// Request interceptor to attach JWT Token
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("smart_food_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized response
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired
      if (localStorage.getItem("smart_food_token")) {
        localStorage.removeItem("smart_food_token");
        localStorage.removeItem("smart_food_user");
      }
    }
    return Promise.reject(error);
  }
);
