import axios from "axios";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the httpOnly refreshToken cookie
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Queue of requests waiting for an in-flight refresh call to finish,
// so concurrent 401s don't each trigger their own /auth/refresh call.
let isRefreshing = false;
let pendingQueue = [];

const resolveQueue = (token, error) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

const goToLogin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response && error.response.status;

    if (status !== 401 || !originalRequest || originalRequest._retry) {
      if (status === 401) {
        goToLogin();
      }
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Plain axios call (not `api`) so this doesn't go through the same
      // interceptors and loop back into itself if the refresh token is bad.
      const { data } = await axios.post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      localStorage.setItem("token", data.access_token);
      resolveQueue(data.access_token, null);

      originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;
      return api(originalRequest);
    } catch (refreshError) {
      resolveQueue(null, refreshError);
      goToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
