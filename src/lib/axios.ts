// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:3004/api",
});

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const refreshRes = await axios.post("/refresh", {
          refreshToken,
        });

        const newAccessToken = refreshRes.data.token; // or refreshRes.data.accessToken

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        Cookies.set("access_token", newAccessToken, { expires: 1 / 24 }); // 1 hour

        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;



// import axios from "axios";
// import Cookies from "js-cookie";

// const api = axios.create({
//   baseURL: "http://localhost:3004/api",
// });

// api.interceptors.request.use((config) => {
//   const token = Cookies.get("token"); 

//   console.log("TOKEN SENT:", token); 

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;