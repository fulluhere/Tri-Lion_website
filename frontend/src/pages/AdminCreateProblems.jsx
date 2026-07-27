// frontend/src/pages/AdminCreateProblem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProblem } from "../api/problems";

const emptyTestCase = () => ({ input: "", expectedOutput: "", isHidden: false });

export default function AdminCreateProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState("");
  const [constraints, setConstraints] = useState("");
  const [testCases, setTestCases] = useState([emptyTestCase()]);
  const [isPublished, setIsPublished] = useState(true);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateTestCase = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => setTestCases([...testCases, emptyTestCase()]);
  const removeTestCase = (index) => setTestCases(testCases.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await createProblem({
        title,
        description,
        difficulty,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        constraints,
        testCases,
        isPublished,
      });
      setSuccess(`"${res.data.title}" created successfully!`);
      setTimeout(() => navigate(`/problems/${res.data.slug}`), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Create Problem</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Array, Hash Table"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Constraints</label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4"
            />
            Publish immediately
          </label>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Test Cases</h3>
            <button
              type="button"
              onClick={addTestCase}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              + Add Test Case
            </button>
          </div>

          {testCases.map((tc, i) => (
            <div key={i} className="mb-4 p-4 bg-gray-50 rounded-xl relative">
              {testCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestCase(i)}
                  className="absolute top-3 right-3 text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Input</label>
                  <textarea
                    value={tc.input}
                    onChange={(e) => updateTestCase(i, "input", e.target.value)}
                    required
                    rows={3}
                    className="w-full px-2 py-1.5 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Expected Output</label>
                  <textarea
                    value={tc.expectedOutput}
                    onChange={(e) => updateTestCase(i, "expectedOutput", e.target.value)}
                    required
                    rows={3}
                    className="w-full px-2 py-1.5 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={tc.isHidden}
                  onChange={(e) => updateTestCase(i, "isHidden", e.target.checked)}
                  className="w-3.5 h-3.5"
                />
                Hidden test case
              </label>
            </div>
          ))}
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-base font-bold bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          {loading ? "Creating..." : "Create Problem"}
        </button>
      </form>
    </div>
  );
}