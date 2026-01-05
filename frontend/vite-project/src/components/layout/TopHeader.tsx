import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { fetchStaff } from "../../api/siadAPI";
import { Button } from "../ui/button";

interface Staff {
    staff_id: string;
    staff_name: string;
    role: string;
    service: string;
}

interface TopHeaderProps {
    toggleSidebar: () => void;
}

const TopHeader = ({ toggleSidebar }: TopHeaderProps) => {
    const { user, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Staff[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [allStaff, setAllStaff] = useState<Staff[]>([]);

    useEffect(() => {
        if (user?.role !== "admin") {
            setAllStaff([]);
            return;
        }
        fetchStaff().then(setAllStaff).catch(console.error);
    }, [user?.role]);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = allStaff.filter(staff =>
                staff.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.service.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 5); // Limit to 5 results
            setSearchResults(filtered);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    }, [searchTerm, allStaff]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bonjour";
        if (hour < 18) return "Bon après-midi";
        return "Bonsoir";
    };

    return (
        <div className="bg-white border-bottom p-3 p-lg-4 position-sticky top-0 z-10">
            <div className="d-flex align-items-center justify-content-between">
                {/* Left side: Hamburger + Greeting */}
                <div className="d-flex align-items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="d-lg-none"
                        onClick={toggleSidebar}
                    >
                        ☰
                    </Button>
                    <div>
                        <h1 className="h5 fw-bold mb-0" style={{ color: '#1e293b' }}>
                            {getGreeting()}, {user?.username || 'Dr. User'}
                        </h1>
                        <p className="text-muted d-none d-md-block" style={{ fontSize: '0.875rem' }}>
                            Voici un aperçu de l'activité hospitalière
                        </p>
                    </div>
                </div>

                {/* Right side: Search + User + Logout */}
                <div className="d-flex align-items-center gap-2 gap-md-3">
                    {/* Search Bar */}
                    <div className="position-relative d-none d-md-block" style={{ width: '320px' }}>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">🔍</span>
                            <input
                                type="text"
                                className="form-control border-start-0 bg-light"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => searchTerm && setShowResults(true)}
                                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                            />
                        </div>
                        {showResults && searchResults.length > 0 && (
                            <div className="card position-absolute w-100 mt-1 shadow-lg border-0">
                                <div className="list-group list-group-flush">
                                    {searchResults.map((staff) => (
                                        <div key={staff.staff_id} className="list-group-item list-group-item-action">
                                            <div className="fw-bold">{staff.staff_name}</div>
                                            <div className="text-muted small">{staff.role} - {staff.service}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Avatar */}
                    <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                            {user?.username?.charAt(0).toUpperCase() || 'D'}
                        </div>
                        <div className="d-none d-lg-block">
                            <div className="fw-semibold">{user?.username}</div>
                            <div className="text-muted small">{user?.role === 'admin' ? 'Chef de Service' : 'Staff'}</div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <Button variant="outline" onClick={logout}>
                        Déconnexion
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
