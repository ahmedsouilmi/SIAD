import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const SIDEBAR_WIDTH = 240;

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const menuItems = [
    { path: "/admin", icon: "📊", label: "Dashboard" },
    { path: "/staff/list", icon: "👨‍⚕️", label: "Staff Management" },
    { path: "/patients", icon: "👥", label: "Patients" },
    { path: "/admin/staff-schedule", icon: "📅", label: "Schedule" },
    { path: "/services-weekly", icon: "📈", label: "Reports" },
    { path: "/weekly-recommendations", icon: "✅", label: "Weekly Recommendations" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-75 d-lg-none"
          style={{ zIndex: 999 }}
          onClick={toggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`d-flex flex-column bg-dark text-light position-fixed top-0 bottom-0 d-lg-flex ${
          isOpen ? "d-flex" : "d-none"
        }`}
        style={{
          width: SIDEBAR_WIDTH,
          left: 0,
          zIndex: 1000,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Logo */}
        <div className="p-4 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-primary rounded-2 d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40, fontSize: 20 }}
            >
              🏥
            </div>
            <div>
              <div className="fw-bold fs-5">SIAD</div>
              <div className="small text-muted">
                Système d'Aide à la Décision
              </div>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="p-3 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-primary d-flex align-items-center justify-content-center fw-bold text-white"
              style={{ width: 36, height: 36 }}
            >
              {user?.username?.charAt(0).toUpperCase() || "D"}
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <div className="fw-semibold text-truncate">
                {user?.username || "Dr. User"}
              </div>
              <div className="small text-muted">
                {user?.role === "admin" ? "Chef de Service" : "Staff"}
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-grow-1 py-3 d-flex flex-column gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isOpen && toggle()}
              className={`text-decoration-none d-flex align-items-center gap-3 px-4 py-2 mx-2 rounded-3 ${
                isActive(item.path)
                  ? "bg-primary text-white fw-bold"
                  : "text-light"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-top border-secondary">
          <button
            onClick={logout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
          >
            🔓 Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
