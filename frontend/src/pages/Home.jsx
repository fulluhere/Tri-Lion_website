import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Welcome to <span className="text-indigo-600">DoCode</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Sharpen your problem-solving skills. Solve coding challenges, compete on the leaderboard, and get AI-powered hints along the way.
      </p>

      {user && (
        <p className="mt-8 text-lg text-gray-700">
          Welcome back, <span className="font-semibold text-indigo-600">{user.username}</span>!
        </p>
      )}

      <div className="mt-10 flex items-center justify-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="px-8 py-3.5 text-lg font-semibold bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all">
              Go to Dashboard
            </Link>
            <Link to="/problems" className="px-8 py-3.5 text-lg font-semibold bg-white text-gray-800 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-all">
              Browse Problems
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="px-8 py-3.5 text-lg font-semibold bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all">
              Login
            </Link>
            <Link to="/register" className="px-8 py-3.5 text-lg font-semibold bg-white text-gray-800 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-all">
              Register
            </Link>
          </>
        )}
      </div>

      <div className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="text-4xl mb-4">🧩</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Solve Problems</h3>
          <p className="text-base text-gray-600 leading-relaxed">Practice with a growing library of coding challenges across difficulty levels.</p>
        </div>
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Compete</h3>
          <p className="text-base text-gray-600 leading-relaxed">Climb the leaderboard as you solve more problems.</p>
        </div>
        <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Hints</h3>
          <p className="text-base text-gray-600 leading-relaxed">Get step-by-step guidance when you're stuck, without spoiling the solution.</p>
        </div>
      </div>
    </div>
  );
}