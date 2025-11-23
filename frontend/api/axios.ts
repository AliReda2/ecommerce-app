import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent infinite loop if refresh also returns 401
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
            .finally(() => {
              refreshPromise = null;
            });
        }

        await refreshPromise;

        return api(originalRequest);
      } catch (err) {
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
