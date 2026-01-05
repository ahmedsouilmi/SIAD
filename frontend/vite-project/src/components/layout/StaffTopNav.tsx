import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const StaffTopNav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm mb-8">
      <div className="flex items-center gap-6">
        <span className="text-2xl font-bold text-blue-700 tracking-tight">SIAD</span>
        <Link className="text-gray-700 hover:text-blue-700 font-semibold" to="/staff">
          Dashboard
        </Link>
        <Link className="text-gray-700 hover:text-blue-700" to="/staff/patients">
          Patients
        </Link>
        <Link className="text-gray-700 hover:text-blue-700" to="/staff-schedule">
          My Schedule
        </Link>
        <Link className="text-gray-700 hover:text-blue-700" to="/staff/recommendations">
          My Recommendations
        </Link>
          <Link className="text-gray-700 hover:text-blue-700" to="/staff/patients">
          Service Info
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="hidden sm:block text-gray-600 font-medium">{user.username}</span>
            <div className="relative group">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold uppercase cursor-pointer select-none">
                {user.username ? user.username.charAt(0) : "?"}
              </div>
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
            <button
              className="btn btn-outline-danger d-flex align-items-center"
              onClick={handleLogout}
            >
              <span className="me-2">🔓</span>
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default StaffTopNav;
