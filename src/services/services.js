import axios from "axios";
import Cookies from "js-cookie";


const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004",
   withCredentials: true 
});

// Copy your interceptor from lib/axios.ts
API.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  console.log("TOKEN SENT:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// USERS //

export const login = (data) => API.post("/api/login", data);
export const register = (data) => API.post("/api/register", data);
export const getEmployee = () => API.get("/api/employee");
export const deleteEmployee = (id) => API.delete(`/api/delete-employee/${id}`)
export const createEmployee = (data)=> API.post("/api/create-employee", data)
export const employeeLogin = (data) => API.post("/api/employee/login", data);
export const changePassword = (email) => API.post(`/api/change-password-by-email/${email}`);
export const resetPassword = (data) => API.post("/api/reset-password", data);