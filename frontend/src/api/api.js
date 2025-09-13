import axios from "axios";

const api = axios.create({
  baseURL: "https://lead-management-system-conk.onrender.com/api", 
  withCredentials: true, 
});

export default api;
