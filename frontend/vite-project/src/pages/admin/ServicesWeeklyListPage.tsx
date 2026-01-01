import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { fetchServicesWeekly } from "../../api/siadAPI";

interface ServiceWeekly {
  week: number;
  month: number;
  service: string;
  available_beds: number;
  patients_request: number;
  patients_admitted: number;
  patients_refused: number;
  patient_satisfaction: number;
  staff_morale: number;
  event: string;
}

const ServicesWeeklyListPage = () => {
  const [services, setServices] = useState<ServiceWeekly[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWeekly[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchServicesWeekly().then(data => {
      setServices(data);
      setFilteredServices(data);
    });
  }, []);

  useEffect(() => {
    const filtered = services.filter(s =>
      s.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(s.week).includes(searchTerm) ||
      String(s.month).includes(searchTerm)
    );
    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [searchTerm, services]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="h3 fw-bold mb-1" style={{ color: '#1e293b' }}>Services Hebdomadaires</h2>
        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
          Suivi hebdomadaire des services hospitaliers
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
                  placeholder="Rechercher par service, événement, semaine ou mois..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: '0.875rem' }}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: '0.875rem' }}>
                <strong>{currentItems.length}</strong> sur <strong>{filteredServices.length}</strong> enregistrements
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Weekly Table */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Semaine</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mois</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lits Dispo.</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demandes</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admis</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Refusés</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Satisfaction</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Morale</th>
                <th className="px-4 py-3 fw-semibold" style={{ color: '#475569', fontSize: '0.813rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Événement</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((s, index) => (
                  <tr key={index} style={{
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
                      }}>{s.week}</span>
                    </td>
                    <td className="px-4 py-3">{s.month}</td>
                    <td className="px-4 py-3" style={{ color: '#475569', fontSize: '0.875rem' }}>{s.service}</td>
                    <td className="px-4 py-3">{s.available_beds}</td>
                    <td className="px-4 py-3">{s.patients_request}</td>
                    <td className="px-4 py-3">{s.patients_admitted}</td>
                    <td className="px-4 py-3">{s.patients_refused}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-info" style={{
                        fontWeight: '500',
                        fontSize: '0.75rem',
                        padding: '0.375rem 0.75rem'
                      }}>{s.patient_satisfaction}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{
                        display: 'inline-block',
                        background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
                        color: 'white',
                        borderRadius: '0.75rem',
                        fontWeight: 700,
                        fontSize: '1rem',
                        padding: '0.45rem 1.3rem',
                        letterSpacing: '0.03em',
                        boxShadow: '0 1px 4px 0 rgba(30,41,59,0.10)',
                        border: '2px solid #1e40af',
                        outline: 'none',
                        minWidth: '2.7em',
                        textAlign: 'center',
                        transition: 'background 0.2s, color 0.2s',
                      }}>{s.staff_morale}</span>
                    </td>
                    <td className="px-4 py-3">{s.event}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-5">
                    <div className="text-muted">
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                      <p className="mb-0">Aucun enregistrement trouvé</p>
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

export default ServicesWeeklyListPage;
