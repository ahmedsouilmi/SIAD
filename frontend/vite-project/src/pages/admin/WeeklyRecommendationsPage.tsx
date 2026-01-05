import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  approveRecommendation,
  fetchWeeklyRecommendations,
  rejectRecommendation,
} from "../../api/siadAPI";

type Status = "PENDING" | "APPROVED" | "REJECTED";

interface RecommendationRow {
  id: number;
  week: number;
  staff_id: string;
  staff_name: string;
  role: string;
  current_service: string;
  hours_worked: number;
  recommended_service: string;
  justification: string;
  status: Status;
  decided_by?: string | null;
  decided_at?: string | null;
}

const WeeklyRecommendationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RecommendationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeeklyRecommendations(1);
        if (cancelled) return;
        setRows((data || []) as RecommendationRow[]);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.response?.data?.detail || e?.message || "Failed to load recommendations");
        setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => (a.week ?? 0) - (b.week ?? 0) || a.staff_name.localeCompare(b.staff_name));
  }, [rows]);

  const updateRow = (updated: RecommendationRow) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const statusBadge = (status: Status) => {
    const cls =
      status === "APPROVED"
        ? "badge bg-success"
        : status === "REJECTED"
          ? "badge bg-danger"
          : "badge bg-secondary";
    return <span className={cls}>{status}</span>;
  };

  const handleApprove = async (id: number) => {
    const updated = (await approveRecommendation(id)) as RecommendationRow;
    updateRow(updated);
  };

  const handleReject = async (id: number) => {
    const updated = (await rejectRecommendation(id)) as RecommendationRow;
    updateRow(updated);
  };

  return (
    <DashboardLayout>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Weekly Recommendations</h1>
          <div className="text-muted">Week 1 • Admin validation workflow</div>
        </div>
      </div>

      {loading && <div className="text-muted">Loading...</div>}
      {!loading && error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && sorted.length === 0 && (
        <div className="alert alert-secondary">No recommendations found.</div>
      )}

      {!loading && !error && sorted.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Week</th>
                  <th>Staff Name</th>
                  <th>Role</th>
                  <th>Current Service</th>
                  <th>Hours Worked</th>
                  <th>Recommended Service</th>
                  <th style={{ minWidth: 380 }}>Justification</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => {
                  const decided = r.status !== "PENDING";
                  return (
                    <tr key={r.id}>
                      <td>{r.week}</td>
                      <td>{r.staff_name}</td>
                      <td>{r.role}</td>
                      <td>{r.current_service}</td>
                      <td>{r.hours_worked}</td>
                      <td>{r.recommended_service}</td>
                      <td>{r.justification}</td>
                      <td>{statusBadge(r.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-success"
                            disabled={decided}
                            onClick={() => handleApprove(r.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={decided}
                            onClick={() => handleReject(r.id)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default WeeklyRecommendationsPage;
