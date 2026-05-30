import axios from "axios";
import { AUTH_LOGOUT_EVENT } from "../auth/authEvents";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
        }
        return Promise.reject(error);
    }
)

export default api;