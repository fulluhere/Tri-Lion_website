import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMe } from "../api/user";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMe()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-16 text-lg text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-16 text-lg text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-10">Welcome, {user?.username} 👋</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
          <p className="text-5xl font-extrabold text-indigo-600">{stats?.score ?? 0}</p>
          <p className="text-base text-gray-500 mt-2 font-medium">Total Score</p>
        </div>
        <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
          <p className="text-5xl font-extrabold text-indigo-600">{stats?.problemsSolved ?? 0}</p>
          <p className="text-base text-gray-500 mt-2 font-medium">Problems Solved</p>
        </div>
        <div className="p-8 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
          <p className="text-5xl font-extrabold text-indigo-600 capitalize">{stats?.role ?? "user"}</p>
          <p className="text-base text-gray-500 mt-2 font-medium">Role</p>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <Link to="/problems" className="px-6 py-3 text-base font-semibold bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
          Browse Problems
        </Link>
        <Link to="/leaderboard" className="px-6 py-3 text-base font-semibold bg-white text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          View Leaderboard
        </Link>
      </div>
    </div>
  );
}