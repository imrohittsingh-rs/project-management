import api from "../api/axios.js";

export const register = (userData) => api.post("/auth/register", userData);

export const login = (credentials) => api.post("/auth/login", credentials);

export const logout = () => api.post("/auth/logout");

export const getCurrentUser = () => api.get("/auth/current-user");

export const changePassword = (data) => api.post("/auth/change-password", data);

export const refreshToken = () => api.post("/auth/refresh-token");

export const verifyEmail = (token) => api.get(`/auth/verify-email/${token}`);

export const resendEmailVerification = () => api.post("/auth/resend-verification-email");

export const forgotPassword = (data) => api.post("/auth/forgot-password", data);

export const resetPassword = (token, data) => api.post(`/auth/reset-password/${token}`, data);