import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // NestJS default port

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Single-flight refresh promise to prevent multiple refresh requests when many
// requests receive 401 simultaneously.
let refreshPromise: Promise<any> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(
        "[Axios] 401 received, attempting refresh...",
        originalRequest.url
      );

      try {
        if (!refreshPromise) {
          console.log("[Axios] Creating new refresh promise");
          refreshPromise = axios
            .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
            .then((res) => {
              console.log("[Axios] Refresh successful");
              refreshPromise = null;
              return res;
            })
            .catch((err) => {
              console.error("[Axios] Refresh failed:", err);
              refreshPromise = null;
              throw err;
            });
        } else {
          console.log("[Axios] Reusing existing refresh promise");
        }

        await refreshPromise;
        console.log("[Axios] Retrying original request:", originalRequest.url);

        // retry original request after refresh completes
        return api(originalRequest);
      } catch (refreshError) {
        // failed to refresh, redirect to home/login
        console.error(
          "[Axios] Refresh failed, redirecting to home",
          refreshError
        );
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
