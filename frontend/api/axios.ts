import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh tokens using the refresh cookie
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request with new cookies
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (redirect to login)
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
