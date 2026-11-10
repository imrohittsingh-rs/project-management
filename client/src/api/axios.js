import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

let refreshRequest;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const request = error.config;
        const isRefreshRequest = request?.url?.includes("/auth/refresh-token");

        if (error.response?.status !== 401 || !request || request._retry || isRefreshRequest) {
            return Promise.reject(error);
        }

        request._retry = true;
        try {
            refreshRequest ??= api.post("/auth/refresh-token");
            await refreshRequest;
            return api(request);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        } finally {
            refreshRequest = undefined;
        }
    },
);

export default api;
