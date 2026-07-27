import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/logo.svg";
export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center gap-8 px-8 py-5 border-b border-gray-200 bg-white shadow-sm">
      <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight"> <img src={logo} alt="DoCode logo" className="h-9 w-9" />
        <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">DoCode</span></Link>

      {user && <Link to="/dashboard" className="text-base font-medium text-gray-700 hover:text-indigo-600 transition">Dashboard</Link>}
      {user && <Link to="/problems" className="text-base font-medium text-gray-700 hover:text-indigo-600 transition">Problems</Link>}
      {user && <Link to="/submissions" className="text-base font-medium text-gray-700 hover:text-indigo-600 transition">Submissions</Link>}
      {user && <Link to="/leaderboard" className="text-base font-medium text-gray-700 hover:text-indigo-600 transition">Leaderboard</Link>}
      {user?.role === "admin" && (
        <Link to="/admin/create-problem" className="text-base font-medium text-gray-700 hover:text-indigo-600 transition">
          + New Problem
        </Link>
      )}
      <div className="ml-auto flex items-center gap-5">
        {user ? (
          <>
            <span className="text-base text-gray-600">
              {user.username} <span className="text-gray-400 text-sm">({user.role})</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-base font-medium text-gray-700 hover:text-indigo-600 transition">Login</Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}