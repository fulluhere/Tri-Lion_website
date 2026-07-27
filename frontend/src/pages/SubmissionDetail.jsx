import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubmission } from "../api/submissions";

const verdictColor = {
  AC: "text-green-700 bg-green-100",
  WA: "text-red-700 bg-red-100",
  TLE: "text-orange-700 bg-orange-100",
  RE: "text-red-700 bg-red-100",
  CE: "text-gray-700 bg-gray-200",
  PENDING: "text-yellow-700 bg-yellow-100",
};

export default function SubmissionDetail() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getSubmission(id)
      .then((res) => setSubmission(res.data.submission))
      .catch((err) => setError(err.response?.data?.message || "Failed to load submission"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-16 text-lg text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-16 text-lg text-red-600">{error}</p>;
  if (!submission) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Submission Detail</h2>

      <div className="flex flex-wrap gap-3 mb-8">
        <span className={`text-base font-bold px-4 py-2 rounded-full ${verdictColor[submission.verdict] || ""}`}>
          {submission.verdict}
        </span>
        <span className="text-base text-gray-700 px-4 py-2 bg-gray-100 rounded-full capitalize font-medium">{submission.language}</span>
        <span className="text-base text-gray-700 px-4 py-2 bg-gray-100 rounded-full font-medium">{submission.runtime}ms</span>
        <span className="text-base text-gray-700 px-4 py-2 bg-gray-100 rounded-full font-medium">
          {submission.testCasesPassed} / {submission.testCasesTotal} passed
        </span>
      </div>

      {submission.errorMessage && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Error</h3>
          <pre className="text-red-700 bg-red-50 p-5 rounded-xl text-base overflow-x-auto">{submission.errorMessage}</pre>
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-800 mb-3">Code</h3>
      <pre className="bg-gray-900 text-gray-100 p-5 rounded-xl text-base overflow-x-auto">{submission.code}</pre>
    </div>
  );
}