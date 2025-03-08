import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://gorest.co.in/public/v2/",
});

axiosInstance.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_GOREST_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
