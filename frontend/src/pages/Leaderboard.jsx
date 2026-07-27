import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/leaderboard";

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeaderboard()
      .then((res) => setEntries(res.data.leaderboard))
      .catch((err) => setError(err.response?.data?.message || "Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-16 text-lg text-gray-500">Loading leaderboard...</p>;
  if (error) return <p className="text-center mt-16 text-lg text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">🏆 Leaderboard</h2>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Solved</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((user, i) => (
              <tr key={user._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-xl font-bold text-gray-700">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </td>
                <td className="px-6 py-4 text-lg font-semibold text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-lg text-indigo-600 font-bold">{user.score}</td>
                <td className="px-6 py-4 text-base text-gray-600">{user.problemsSolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {entries.length === 0 && <p className="p-6 text-gray-500 text-base">No entries yet.</p>}
      </div>
    </div>
  );
}