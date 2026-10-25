import api from "../api/axios.js";

export const register = async (userData) => {
    const res = await api.post("/auth/register", userData);
    return res.data;
}

export const login = async (userData) => {
    const res = await api.post("/auth/login", userData);
    return res.data;
}

export const logout = async () => {
    const res = await api.post("/auth/logout");
    return res.data;
}

export const getCurrentUser = async () => {
    const res = await api.get("/auth/current-user");
    return res.data;
}

export const changePassword = async (passwordData) => {
    const res = await api.post("/auth/change-password", passwordData);
    return res.data;
}

export const refreshAccessToken = async () => {
    const res = await api.post("/auth/refresh-token");
    return res.data;
}

export const forgotPassword = async (email) => {
    const res = await api.post("/auth/forgot-password", email);
    return res.data;
}

export const resetPassword = async (resetToken, newPassword) => {
    const res = await api.post(`/auth/reset-password/${resetToken}`, {newPassword});
    return res.data;
}

export const resendVerificationEmail = async () => {
    const res = await api.post("/auth/resend-email-verification");
    return res.data;
}

export const verifyEmail = async (verificationToken) => {
    const res = await api.get(`/auth/verify-email/${verificationToken}`);
    return res.data;
}