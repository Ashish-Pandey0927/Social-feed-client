import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Change if hosted elsewhere
});

// Automatically attach token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// (Optional) Add global error handling here if needed
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized, maybe log out user");
      // You can optionally clear token and redirect here
    }
    return Promise.reject(error);
  }
);

export default instance;
