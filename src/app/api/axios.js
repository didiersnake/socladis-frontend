import axios from "axios";

const api = axios.create({
  baseURL: "http://158.220.98.45:5000",
  withCredentials: true,
});
export default api;
