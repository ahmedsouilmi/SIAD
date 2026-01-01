import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { fetchStaff } from "../../api/siadAPI";

interface Staff {
    staff_id: string;
    staff_name: string;
    role: string;
    service: string;
}

const TopHeader = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Staff[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [allStaff, setAllStaff] = useState<Staff[]>([]);

    useEffect(() => {
        fetchStaff().then(setAllStaff).catch(console.error);
    }, []);

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
        <div className="bg-white border-bottom" style={{
            padding: '1.25rem 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 999
        }}>
            <div className="d-flex align-items-center justify-content-between">
                {/* Greeting Section */}
                <div>
                    <h1 className="h4 fw-bold mb-1" style={{ color: '#1e293b' }}>
                        {getGreeting()}, {user?.username || 'Dr. User'}
                    </h1>
                    <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                        Voici un aperçu de l'activité hospitalière
                    </p>
                </div>

                {/* Search and User Section */}
                <div className="d-flex align-items-center gap-3">
                    {/* Search Bar */}
                    <div style={{ position: 'relative', width: '320px' }}>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0" style={{ color: '#94a3b8' }}>
                                🔍
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => searchTerm && setShowResults(true)}
                                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                                style={{
                                    fontSize: '0.875rem',
                                    paddingLeft: 0
                                }}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && searchResults.length > 0 && (
                            <div className="card position-absolute w-100 mt-1 shadow-lg border-0" style={{
                                zIndex: 1000,
                                maxHeight: '300px',
                                overflowY: 'auto'
                            }}>
                                <div className="list-group list-group-flush">
                                    {searchResults.map((staff) => (
                                        <div
                                            key={staff.staff_id}
                                            className="list-group-item list-group-item-action"
                                            style={{ cursor: 'pointer', padding: '0.75rem 1rem' }}
                                        >
                                            <div className="d-flex align-items-center gap-2">
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#e0f2fe',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 'bold',
                                                    color: '#0284c7'
                                                }}>
                                                    {staff.staff_name.charAt(0)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div className="fw-semibold" style={{ fontSize: '0.875rem' }}>
                                                        {staff.staff_name}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                        {staff.role} • {staff.service}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notification Bell removed as requested */}

                    {/* User Avatar */}
                    <div className="d-flex align-items-center gap-2">
                        <div>
                            <div className="text-end fw-semibold" style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                                {user?.username || 'Dr. User'}
                            </div>
                            <div className="text-end text-muted" style={{ fontSize: '0.75rem' }}>
                                {user?.role === 'admin' ? 'Cardiology' : 'Staff'}
                            </div>
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.125rem',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            {user?.username?.charAt(0).toUpperCase() || 'D'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
