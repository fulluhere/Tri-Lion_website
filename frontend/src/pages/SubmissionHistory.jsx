import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMySubmissions } from "../api/submissions";

const verdictColor = {
  AC: "text-green-700 bg-green-100",
  WA: "text-red-700 bg-red-100",
  TLE: "text-orange-700 bg-orange-100",
  RE: "text-red-700 bg-red-100",
  CE: "text-gray-700 bg-gray-200",
  PENDING: "text-yellow-700 bg-yellow-100",
};

export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMySubmissions()
      .then((res) => setSubmissions(res.data.submissions))
      .catch((err) => setError(err.response?.data?.message || "Failed to load submissions"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-16 text-lg text-gray-500">Loading submissions...</p>;
  if (error) return <p className="text-center mt-16 text-lg text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">My Submissions</h2>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-sm text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Language</th>
              <th className="px-6 py-4">Verdict</th>
              <th className="px-6 py-4">Runtime</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-base text-gray-600">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-base text-gray-700 capitalize font-medium">{s.language}</td>
                <td className="px-6 py-4">
                  <Link to={`/submissions/${s._id}`}>
                    <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${verdictColor[s.verdict] || ""}`}>
                      {s.verdict}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-4 text-base text-gray-600">{s.runtime}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
        {submissions.length === 0 && <p className="p-6 text-gray-500 text-base">No submissions yet.</p>}
      </div>
    </div>
  );
}