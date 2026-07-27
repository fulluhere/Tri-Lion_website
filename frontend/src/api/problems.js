
import api from "./axios";

export const getAllProblems = () => api.get("/problems");
export const getProblemBySlug = (slug) => api.get(`/problems/${slug}`);
export const createProblem = (data) => api.post("/problems", data);
