import axios from "axios";

const api = axios.create({
  baseURL: "http://158.220.98.45:5000",
  // baseURL: "http://localhost:5500",
  withCredentials: true,
});
export default api;
