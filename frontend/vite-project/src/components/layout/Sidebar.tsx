import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { path: "/admin", icon: "📊", label: "Dashboard" },
        { path: "/staff/list", icon: "👨‍⚕️", label: "Staff Management" },
        { path: "/patients", icon: "👥", label: "Patients" },
        { path: "/staff-schedule", icon: "📅", label: "Schedule" },
        { path: "/services-weekly", icon: "📈", label: "Reports" },
    ];

    return (
        <div className="d-flex flex-column h-100 shadow-lg" style={{
            width: '240px',
            background: 'linear-gradient(160deg, #1e293b 60%, #334155 100%)',
            color: '#f1f5f9',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            borderTopRightRadius: '2rem',
            borderBottomRightRadius: '2rem',
            boxShadow: '2px 0 16px 0 rgba(30,41,59,0.10)'
        }}>
            {/* Logo Section */}
            <div className="p-4 border-bottom" style={{ borderColor: '#334155', borderTopRightRadius: '2rem' }}>
                <div className="d-flex align-items-center gap-3">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                    }}>
                        🏥
                    </div>
                    <div>
                        <div className="fw-bold" style={{ fontSize: '1.1rem' }}>SIAD</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Système d'Aide à la Décision
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="p-3 border-bottom" style={{ borderColor: '#334155' }}>
                <div className="d-flex align-items-center gap-2">
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {user?.username?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="fw-semibold" style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.username || 'Dr. User'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {user?.role === 'admin' ? 'Chef de Service' : 'Staff'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow-1 py-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="text-decoration-none d-flex align-items-center gap-3 px-4 py-3"
                        style={{
                            color: isActive(item.path) ? '#fff' : '#cbd5e1',
                            background: isActive(item.path)
                                ? 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)'
                                : 'transparent',
                            borderRadius: '1rem',
                            fontWeight: isActive(item.path) ? '700' : '500',
                            fontSize: '1rem',
                            boxShadow: isActive(item.path) ? '0 2px 8px 0 rgba(96,165,250,0.10)' : 'none',
                            borderLeft: isActive(item.path) ? '4px solid #60a5fa' : '4px solid transparent',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            if (!isActive(item.path)) {
                                e.currentTarget.style.background = '#334155';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isActive(item.path)) {
                                e.currentTarget.style.background = 'transparent';
                            }
                        }}
                    >
                        <span style={{ fontSize: '1.35rem' }}>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-3 border-top" style={{ borderColor: '#334155' }}>
                <button
                    onClick={logout}
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                        background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.75rem',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px 0 rgba(239,68,68,0.10)',
                        letterSpacing: '0.02em',
                        transition: 'background 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #dc2626 0%, #f87171 100%)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'}
                >
                    <span style={{ fontSize: '1.25rem' }}>🚪</span>
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
