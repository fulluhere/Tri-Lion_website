// frontend/src/pages/ProblemDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { getProblemBySlug } from "../api/problems";
import { createSubmission, getSubmission, runCode } from "../api/submissions";
import AIHint from "../components/AIHint";
import AIAnalysis from "../components/AIAnalysis";

const LANGUAGE_DEFAULTS = {
  cpp: `#include<iostream>\nusing namespace std;\nint main(){\n    // your code here\n    return 0;\n}`,
  python: `# your code here\n`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`,
  javascript: `// your code here\n`,
};

const difficultyColor = {
  Easy: "text-green-700 bg-green-100",
  Medium: "text-yellow-700 bg-yellow-100",
  Hard: "text-red-700 bg-red-100",
};

const verdictColor = {
  AC: "text-green-700 bg-green-100 border-green-200",
  WA: "text-red-700 bg-red-100 border-red-200",
  TLE: "text-orange-700 bg-orange-100 border-orange-200",
  RE: "text-red-700 bg-red-100 border-red-200",
  CE: "text-gray-700 bg-gray-200 border-gray-300",
  ERROR: "text-red-700 bg-red-100 border-red-200",
};

export default function ProblemDetail() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(LANGUAGE_DEFAULTS["python"]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    getProblemBySlug(slug)
      .then((res) => setProblem(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load problem"))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    return () => clearInterval(pollRef.current);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(LANGUAGE_DEFAULTS[lang]);
  };

  const pollForResult = (submissionId) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await getSubmission(submissionId);
        const submission = res.data.submission;
        if (submission.verdict !== "PENDING") {
          clearInterval(pollRef.current);
          setResult(submission);
          setSubmitting(false);
        }
      } catch (err) {
        clearInterval(pollRef.current);
        setSubmitting(false);
        setResult({ verdict: "ERROR", errorMessage: "Failed to fetch result" });
      }
    }, 1500);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await createSubmission(problem._id, language, code);
      pollForResult(res.data.submissionId);
    } catch (err) {
      setSubmitting(false);
      setResult({ verdict: "ERROR", errorMessage: err.response?.data?.message || "Submission failed" });
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setRunResult(null);
    try {
      const sampleInput = problem.testCases?.[0]?.input || "";
      const res = await runCode(language, code, sampleInput);
      setRunResult(res.data);
    } catch (err) {
      setRunResult({ verdict: "ERROR", errorMessage: err.response?.data?.error || "Run failed" });
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <p className="text-center mt-16 text-lg text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-16 text-lg text-red-600">{error}</p>;
  if (!problem) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
      {/* Left panel — problem description */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 h-fit">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-3xl font-extrabold text-gray-900">{problem.title}</h2>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${difficultyColor[problem.difficulty] || ""}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {problem.tags?.map((tag) => (
            <span key={tag} className="text-sm font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{problem.description}</p>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-1">Constraints</h4>
          <p className="text-sm text-gray-700 font-mono">{problem.constraints}</p>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-3">Sample Test Cases</h3>
        {problem.testCases?.map((tc, i) => (
          <div key={i} className="mb-4 p-4 bg-gray-900 rounded-xl">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Input</p>
            <pre className="text-sm text-gray-100 mb-3 whitespace-pre-wrap">{tc.input}</pre>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Expected Output</p>
            <pre className="text-sm text-green-400 whitespace-pre-wrap">{tc.expectedOutput}</pre>
          </div>
        ))}
      </div>

      {/* Right panel — editor + submission */}
      <div className="flex flex-col">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>

          <Editor
            height="420px"
            language={language === "cpp" ? "cpp" : language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 16 } }}
          />

          <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="flex-1 py-3 text-base font-bold bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {running ? "Running..." : " Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || running}
              className="flex-1 py-3 text-base font-bold bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? "Judging..." : "Submit"}
            </button>
          </div>
          {runResult && (
            <div className="px-5 pb-5">
              <div className="p-4 bg-gray-900 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  {runResult.verdict === "ERROR" ? "Error" : "Output"}
                </p>
                <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                  {runResult.errorMessage || runResult.output}
                </pre>
                {runResult.runtime !== undefined && (
                  <p className="text-xs text-gray-400 mt-2">{runResult.runtime}ms</p>
                )}
              </div>
            </div>
          )}
          <div className="px-5 pb-5">
            <AIHint problemId={problem._id} userCode={code} />
          </div>
        </div>

        {result && (
          <div className={`mt-6 p-6 rounded-2xl border-2 ${verdictColor[result.verdict] || "border-gray-200 bg-gray-50"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-extrabold">{result.verdict}</span>
              {result.runtime !== undefined && (
                <span className="text-sm font-semibold text-gray-600">{result.runtime}ms</span>
              )}
            </div>
            {result.errorMessage && (
              <pre className="text-sm bg-white/60 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">{result.errorMessage}</pre>
            )}
            {result.output && (
              <pre className="text-sm bg-white/60 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap mt-2">{result.output}</pre>
            )}
            <AIAnalysis submissionId={result._id} verdict={result.verdict} />
          </div>
        )}
      </div>
    </div>
  );
}