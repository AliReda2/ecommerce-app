import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // No cookies; we use Authorization header with Bearer tokens now
  withCredentials: false,
});

// Token storage helpers (client-side only)
export type Tokens = { access_token: string; refresh_token: string };
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
export const tokenStore = {
  get access() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set(tokens: Tokens) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_KEY, tokens.access_token);
    localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${tokens.access_token}`;
  },
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    delete api.defaults.headers.common["Authorization"];
  },
  setAuthHeaderFromStorage() {
    const token = this.access;
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  },
};

// Attach Authorization header if we have it
api.interceptors.request.use((config) => {
  if (!config.headers?.Authorization) {
    const token = tokenStore.access;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  try {
    const method = (config.method || "GET").toUpperCase();
    const url = `${config.baseURL || ""}${config.url || ""}`;
    console.log(`[axios][request] ${method} ${url}`, {
      hasAuth: !!config.headers?.Authorization,
    });
  } catch {}
  return config;
});

// Refresh on 401 using refresh token, then retry once
let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (status === 401 && !original?._retry) {
      original._retry = true;
      const refreshToken = tokenStore.refresh;
      if (!refreshToken) {
        tokenStore.clear();
        return Promise.reject(error);
      }

      // queue requests while a single refresh happens
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((newAccess) => {
            if (newAccess) {
              original.headers = original.headers || {};
              original.headers.Authorization = `Bearer ${newAccess}`;
              resolve(api(original));
            } else {
              reject(error);
            }
          });
        });
      }

      try {
        isRefreshing = true;
        const { data } = await api.post<Tokens>("/auth/refresh", null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });
        tokenStore.set(data);
        // drain queue
        pendingRequests.forEach((cb) => cb(data.access_token));
        pendingRequests = [];
        // retry original
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch (refreshErr) {
        tokenStore.clear();
        pendingRequests.forEach((cb) => cb(null));
        pendingRequests = [];
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    try {
      const cfg = error.config || {};
      const url = `${cfg.baseURL || ""}${cfg.url || ""}`;
      console.error(`[axios][error] ${status ?? "-"} ${url}`, {
        data: error?.response?.data,
      });
    } catch {}
    return Promise.reject(error);
  }
);

// Initialize header from storage on import (client only)
if (typeof window !== "undefined") {
  tokenStore.setAuthHeaderFromStorage();
}
