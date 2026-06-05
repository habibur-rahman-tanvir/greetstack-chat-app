import { BASE_URL } from "@/configs/config";
import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export { api };

// import axios, { AxiosError } from "axios";
// import { BASE_URL } from "../configs/config";

// const api = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (err, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (err) {
//       prom.reject(err);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (err) => {
//     if (!(err instanceof AxiosError)) throw err;

//     const originalRequest = err.config;

//     if (
//       err.response &&
//       err.response.status === 401 &&
//       err.response.headers["x-token-expired"] === "true" &&
//       !originalRequest._retry
//     ) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const res = await axios.post(
//           `${BASE_URL}/api/auth/refresh`,
//           {},
//           { withCredentials: true },
//         );
//         const newAccessToken = res.data.accessToken;
//         localStorage.setItem("accessToken", newAccessToken);
//         processQueue(null, newAccessToken);
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         localStorage.removeItem("accessToken");

//         window.dispatchEvent(new CustomEvent("auth:unauthorized"));

//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }
//     return Promise.reject(err);
//   },
// );

// export { api };
