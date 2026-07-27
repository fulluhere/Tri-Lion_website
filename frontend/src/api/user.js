// frontend/src/api/user.js
import api from "./axios";

export const getMe = () => api.get("/auth/get-me");