import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProblems } from "../api/problems";

const difficultyColor = {
  Easy: "text-green-700 bg-green-100",
  Medium: "text-yellow-700 bg-yellow-100",
  Hard: "text-red-700 bg-red-100",
};

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllProblems()
      .then((res) => setProblems(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load problems"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-16 text-lg text-gray-500">Loading problems...</p>;
  if (error) return <p className="text-center mt-16 text-lg text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Problems</h2>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Difficulty</th>
              <th className="px-6 py-4">Tags</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr key={p.slug} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <Link to={`/problems/${p.slug}`} className="text-lg text-indigo-600 hover:underline font-semibold">
                    {p.title}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${difficultyColor[p.difficulty] || ""}`}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-base text-gray-600">{p.tags?.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {problems.length === 0 && <p className="p-6 text-gray-500 text-base">No problems published yet.</p>}
      </div>
    </div>
  );
}