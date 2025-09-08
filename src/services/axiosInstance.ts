import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
      const isTokenExpired = tokenPayload.exp * 1000 < Date.now(); // Verificar si el token expiró

      if (isTokenExpired && refreshToken) {
        try {
          const refreshResponse = await axios.post(
            "http://localhost:3000/auth/refresh",
            {
              refreshToken,
            },
          );

          localStorage.setItem(
            "access_token",
            refreshResponse.data.access_token,
          );
          config.headers["Authorization"] =
            `Bearer ${refreshResponse.data.access_token}`;
        } catch (error) {
          console.error("Error al refrescar el token:", error);
          window.location.href = "/login"; // Redirigir al login si el refresh falla
        }
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente devuélvela
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es un 401 (no autorizado) y no hemos intentado ya refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshResponse = await axios.post(
          "http://localhost:3000/auth/refresh",
          {
            token: localStorage.getItem("refresh_token"),
          },
        );

        // Guardar el nuevo token de acceso
        localStorage.setItem("access_token", refreshResponse.data.access_token);

        // Actualizar el encabezado de autorización y reintentar la solicitud original
        originalRequest.headers["Authorization"] =
          `Bearer ${refreshResponse.data.access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Error al refrescar el token:", refreshError);
        // Redirigir al usuario al login si el refresh falla
        window.location.href = "/login";
      }
    }

    // Si no es un error 401 o el refresh falla, rechazar la promesa
    return Promise.reject(error);
  },
);

export default axiosInstance;
