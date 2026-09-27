import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true // Required for cookies (access token + refresh token)
})

export default api;