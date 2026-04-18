import axios from "axios";

const api = axios.create({
  baseURL: "https://career-forge-server.onrender.com/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    //console.log("INTERCEPTOR TOKEN:", token);

    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;