import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { fetchStaffSchedule } from "../../api/siadAPI";

interface StaffSchedule {
    week: number;
    staff_id: string;
    staff_name: string;
    role: string;
    service: string;
    present: number;
}

const StaffSchedulePage = () => {
    const [schedule, setSchedule] = useState<StaffSchedule[]>([]);
    const [filteredSchedule, setFilteredSchedule] = useState<StaffSchedule[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedWeek, setSelectedWeek] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchStaffSchedule().then(data => {
            setSchedule(data);
            setFilteredSchedule(data);
        });
    }, []);

    useEffect(() => {
        let filtered = schedule.filter(item =>
            item.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.staff_id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (selectedWeek !== "all") {
            filtered = filtered.filter(item => item.week === parseInt(selectedWeek));
        }

        setFilteredSchedule(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedWeek, schedule]);

    // Get unique weeks for filter
    const uniqueWeeks = Array.from(new Set(schedule.map(item => item.week))).sort((a, b) => a - b);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSchedule.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const getAttendanceColor = (present: number) => {
        if (present >= 5) return { bg: '#dcfce7', text: '#166534', label: 'Excellent' };
        if (present >= 3) return { bg: '#fef3c7', text: '#92400e', label: 'Moyen' };
        return { bg: '#fee2e2', text: '#991b1b', label: 'Faible' };
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-4">
                <h2 className="h3 fw-bold mb-1" style={{ color: '#1e293b' }}>Planning du Personnel</h2>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                    Consulter et gérer les plannings de présence du personnel
                </p>
            </div>

            {/* Search and Filter Card */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row align-items-center g-3">
                        <div className="col-md-5">
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
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={selectedWeek}
                                onChange={(e) => setSelectedWeek(e.target.value)}
                                style={{ fontSize: '0.875rem' }}
                            >
                                <option value="all">Toutes les semaines</option>
                                {uniqueWeeks.map(week => (
                                    <option key={week} value={week}>Semaine {week}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 text-end">
                            <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '0.875rem' }}>
                                <strong>{currentItems.length}</strong> sur <strong>{filteredSchedule.length}</strong> enregistrements
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Schedule Table */}
            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                            <tr>
                                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Semaine
                                </th>
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
                                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Présence
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => {
                                    const attendanceColor = getAttendanceColor(item.present);
                                    return (
                                        <tr key={`${item.staff_id}-${item.week}-${index}`} style={{
                                            backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc',
                                            transition: 'background-color 0.2s'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'white' : '#f8fafc'}>
                                            <td className="px-4 py-3">
                                                <span style={{
                                                    display: 'inline-block',
                                                    background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
                                                    color: 'white',
                                                    borderRadius: '0.75rem',
                                                    fontWeight: 600,
                                                    fontSize: '0.85rem',
                                                    padding: '0.375rem 1.1rem',
                                                    letterSpacing: '0.03em',
                                                    boxShadow: '0 1px 4px 0 rgba(30,41,59,0.07)'
                                                }}>
                                                    Semaine {item.week}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="badge" style={{
                                                    backgroundColor: '#e0f2fe',
                                                    color: '#0369a1',
                                                    fontWeight: '500',
                                                    fontSize: '0.75rem',
                                                    padding: '0.375rem 0.75rem'
                                                }}>
                                                    {item.staff_id}
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
                                                        {item.staff_name.charAt(0)}
                                                    </div>
                                                    <span className="fw-semibold" style={{ color: '#1e293b', fontSize: '0.875rem' }}>
                                                        {item.staff_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="badge" style={{
                                                    backgroundColor: item.role.toLowerCase().includes('doctor') || item.role.toLowerCase().includes('médecin') ? '#dbeafe' : '#fce7f3',
                                                    color: item.role.toLowerCase().includes('doctor') || item.role.toLowerCase().includes('médecin') ? '#1e40af' : '#9f1239',
                                                    fontWeight: '500',
                                                    fontSize: '0.75rem',
                                                    padding: '0.375rem 0.75rem'
                                                }}>
                                                    {item.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.875rem' }}>
                                                {item.service}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{ flex: 1, maxWidth: '120px' }}>
                                                        <div className="progress" style={{ height: '8px', backgroundColor: '#e2e8f0' }}>
                                                            <div
                                                                className="progress-bar"
                                                                role="progressbar"
                                                                style={{
                                                                    width: `${(item.present / 7) * 100}%`,
                                                                    backgroundColor: item.present >= 5 ? '#10b981' : item.present >= 3 ? '#f59e0b' : '#ef4444'
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <span className="fw-bold" style={{ fontSize: '0.875rem', color: '#1e293b', minWidth: '40px' }}>
                                                        {item.present}/7
                                                    </span>
                                                    <span className="badge" style={{
                                                        backgroundColor: attendanceColor.bg,
                                                        color: attendanceColor.text,
                                                        fontWeight: '500',
                                                        fontSize: '0.7rem',
                                                        padding: '0.25rem 0.5rem'
                                                    }}>
                                                        {attendanceColor.label}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-5">
                                        <div className="text-muted">
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                                            <p className="mb-0">Aucun enregistrement de planning trouvé</p>
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
                                {/* Show max 5 page buttons with ellipsis */}
                                {(() => {
                                  const pageButtons = [];
                                  let start = Math.max(1, currentPage - 2);
                                  let end = Math.min(totalPages, currentPage + 2);
                                  if (currentPage <= 3) {
                                    start = 1;
                                    end = Math.min(5, totalPages);
                                  } else if (currentPage >= totalPages - 2) {
                                    end = totalPages;
                                    start = Math.max(1, totalPages - 4);
                                  }
                                  if (start > 1) {
                                    pageButtons.push(
                                      <li key="start-ellipsis" style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontWeight: 700, fontSize: '1.2em', padding: '0 0.5em' }}>…</li>
                                    );
                                  }
                                  for (let i = start; i <= end; i++) {
                                    pageButtons.push(
                                      <li key={i} style={{ borderRadius: '0.5rem', display: 'flex' }}>
                                        <button
                                          onClick={() => handlePageChange(i)}
                                          style={{
                                            backgroundColor: currentPage === i ? '#3b82f6' : 'white',
                                            color: currentPage === i ? 'white' : '#3b82f6',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.5rem',
                                            fontWeight: currentPage === i ? 700 : 500,
                                            transition: 'background 0.2s, color 0.2s',
                                            padding: '0.5rem 0.9rem',
                                            minWidth: '38px',
                                            cursor: 'pointer',
                                            outline: 'none',
                                          }}
                                        >
                                          {i}
                                        </button>
                                      </li>
                                    );
                                  }
                                  if (end < totalPages) {
                                    pageButtons.push(
                                      <li key="end-ellipsis" style={{ display: 'flex', alignItems: 'center', color: '#64748b', fontWeight: 700, fontSize: '1.2em', padding: '0 0.5em' }}>…</li>
                                    );
                                  }
                                  return pageButtons;
                                })()}
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

export default StaffSchedulePage;
