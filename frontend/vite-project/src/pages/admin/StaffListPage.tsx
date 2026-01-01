import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { fetchStaff } from "../../api/siadAPI";

interface Staff {
    staff_id: string;
    staff_name: string;
    role: string;
    service: string;
}

const StaffListPage = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchStaff().then(data => {
            setStaffList(data);
            setFilteredStaff(data);
        });
    }, []);

    useEffect(() => {
        const filtered = staffList.filter(staff =>
            staff.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staff.staff_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStaff(filtered);
        setCurrentPage(1);
    }, [searchTerm, staffList]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="h3 fw-bold mb-1" style={{ color: '#1e293b' }}>Gestion du Personnel</h2>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                    Gérer et consulter tous les membres du personnel hospitalier
                </p>
            </div>

            {/* Search and Stats Card */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row align-items-center g-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0" style={{ color: '#64748b' }}>
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Rechercher par nom, rôle, service ou ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ fontSize: '0.875rem' }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6 text-end">
                            <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '0.875rem' }}>
                                <strong>{currentItems.length}</strong> sur <strong>{filteredStaff.length}</strong> membres du personnel
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Staff Table */}
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <tr>
                                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    ID Personnel
                                </th>
                                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Nom
                                </th>
                                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Rôle
                                </th>
                                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Service
                                </th>
                                <th className="px-4 py-3 fw-semibold text-center" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Statut
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((staff, index) => (
                                    <tr key={staff.staff_id} style={{
                                        backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc',
                                        transition: 'background-color 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8fafc'}>
                                        <td className="px-4 py-3">
                                            <span className="badge" style={{
                                                backgroundColor: '#e0f2fe',
                                                color: '#0369a1',
                                                fontWeight: '500',
                                                fontSize: '0.75rem',
                                                padding: '0.375rem 0.75rem'
                                            }}>
                                                {staff.staff_id}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.875rem',
                                                    fontWeight: 'bold',
                                                    color: 'white'
                                                }}>
                                                    {staff.staff_name.charAt(0)}
                                                </div>
                                                <span className="fw-semibold" style={{ color: '#1e293b', fontSize: '0.875rem' }}>
                                                    {staff.staff_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="badge" style={{
                                                backgroundColor: staff.role.toLowerCase().includes('doctor') || staff.role.toLowerCase().includes('médecin') ? '#dbeafe' : '#fce7f3',
                                                color: staff.role.toLowerCase().includes('doctor') || staff.role.toLowerCase().includes('médecin') ? '#1e40af' : '#9f1239',
                                                fontWeight: '500',
                                                fontSize: '0.75rem',
                                                padding: '0.375rem 0.75rem'
                                            }}>
                                                {staff.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.875rem' }}>
                                            {staff.service}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="badge bg-success" style={{
                                                fontWeight: '500',
                                                fontSize: '0.75rem',
                                                padding: '0.375rem 0.75rem'
                                            }}>
                                                Actif
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-5">
                                        <div className="text-muted">
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                            <p className="mb-0">Aucun membre du personnel trouvé</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="card-footer bg-white border-top d-flex justify-content-center py-3">
                        <nav>
                            <ul
                                className="mb-0"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    flexWrap: 'nowrap',
                                    whiteSpace: 'nowrap',
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0
                                }}
                            >
                                <li style={{ borderRadius: '0.5rem', display: 'flex' }}>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        style={{
                                            color: currentPage === 1 ? '#cbd5e1' : '#3b82f6',
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.5rem',
                                            fontWeight: 500,
                                            padding: '0.5rem 1rem',
                                            minWidth: '90px',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            outline: 'none',
                                        }}
                                    >
                                        ← Précédent
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index + 1} style={{ borderRadius: '0.5rem', display: 'flex' }}>
                                        <button
                                            onClick={() => handlePageChange(index + 1)}
                                            style={{
                                                backgroundColor: currentPage === index + 1 ? '#3b82f6' : 'white',
                                                color: currentPage === index + 1 ? 'white' : '#3b82f6',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '0.5rem',
                                                fontWeight: currentPage === index + 1 ? 700 : 500,
                                                transition: 'background 0.2s, color 0.2s',
                                                padding: '0.5rem 0.9rem',
                                                minWidth: '38px',
                                                cursor: 'pointer',
                                                outline: 'none',
                                            }}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li style={{ borderRadius: '0.5rem', display: 'flex' }}>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        style={{
                                            color: currentPage === totalPages ? '#cbd5e1' : '#3b82f6',
                                            background: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.5rem',
                                            fontWeight: 500,
                                            padding: '0.5rem 1rem',
                                            minWidth: '90px',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            outline: 'none',
                                        }}
                                    >
                                        Suivant →
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StaffListPage;
