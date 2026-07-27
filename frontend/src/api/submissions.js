import axios from "axios";

const compilerApi = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
});

compilerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const runCode = (language, code, input = "") =>
  compilerApi.post("/run", { language, code, input });
export const createSubmission = (problemId, language, code) =>
  compilerApi.post("/submissions", { problemId, language, code });
export const getSubmission = (id) => compilerApi.get(`/submissions/${id}`);
export const getMySubmissions = () => compilerApi.get("/submissions");