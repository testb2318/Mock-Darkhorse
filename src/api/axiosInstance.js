

import axios from "axios";
import { BASE_URL } from "../baseurl";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    if (config.useAdminToken && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor — sirf 401 pe auto logout + redirect
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Sirf 401 (Token expired/invalid) pe logout karo
    // ❌ 400, 403, 404 pe logout nahi — woh normal errors hain
    if (error.response?.status === 401) {
      const adminToken = localStorage.getItem("adminToken");
      const userToken = localStorage.getItem("userToken");

      // ✅ Koi token nahi = public user, redirect mat karo
      if (!adminToken && !userToken) {
        return Promise.reject(error);
      }

      // ✅ Mock session guard — mock token pe logout nahi karo
      const MOCK_TOKEN = "mock-jwt-token-Mock-user-2024";
      if (userToken === MOCK_TOKEN) {
        return Promise.reject(error); // silently ignore, session intact
      }

      console.warn("Token expired — logging out");
      localStorage.clear();

      if (adminToken) {
        window.location.href = "/admin-login";
      } else {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;