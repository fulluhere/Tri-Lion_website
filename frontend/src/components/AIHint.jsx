// frontend/src/components/AIHint.jsx
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance.js";

export default function AIHint({ problemId, userCode }) {
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHint = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/ai/hint", { problemId, userCode });
      setHint(res.data.hint);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get hint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <button
        onClick={fetchHint}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Thinking..." : "💡 Get AI Hint"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {hint && <div className="mt-3 text-sm text-gray-800 whitespace-pre-wrap">{hint}</div>}
    </div>
  );
}