// frontend/src/api/leaderboard.js
import api from "./axios";

export const getLeaderboard = () => api.get("/leaderboard");