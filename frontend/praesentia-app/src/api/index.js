import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.73:3000/api", // <-- backend
  timeout: 5000
});

export default api;