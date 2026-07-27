// frontend/src/components/AIAnalysis.jsx
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";

export default function AIAnalysis({ submissionId, verdict }) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!["WA", "TLE"].includes(verdict)) return null; // matches backend restriction

  const fetchAnalysis = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/ai/report", { submissionId });
      setAnalysis(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get analysis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <button
        onClick={fetchAnalysis}
        disabled={loading}
        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "🔍 What should I do next?"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {analysis && <div className="mt-3 text-sm text-gray-800 whitespace-pre-wrap">{analysis}</div>}
    </div>
  );
}