import { useEffect, useMemo, useState } from "react";
import StaffTopNav from "../../components/layout/StaffTopNav";
import { fetchMyApprovedRecommendations } from "../../api/siadAPI";

interface RecommendationRow {
  id: number;
  week: number;
  recommended_service: string;
  decided_at?: string | null;
}

const MyRecommendationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RecommendationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMyApprovedRecommendations();
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
    return [...rows].sort((a, b) => (a.week ?? 0) - (b.week ?? 0));
  }, [rows]);

  const formatDecisionDate = (iso?: string | null) => {
    if (!iso) return "—";
    const dt = new Date(iso);
    if (Number.isNaN(dt.getTime())) return iso;
    return dt.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffTopNav />

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Recommendations</h2>

          {loading && <div className="py-4 text-gray-500">Loading...</div>}
          {!loading && error && <div className="py-4 text-red-600">{error}</div>}
          {!loading && !error && sorted.length === 0 && (
            <div className="py-4 text-gray-500">No approved recommendations yet.</div>
          )}

          {!loading && !error && sorted.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 pr-4">Week</th>
                    <th className="py-2 pr-4">Recommended Service</th>
                    <th className="py-2 pr-4">Decision Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r) => (
                    <tr key={r.id} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">{r.week}</td>
                      <td className="py-2 pr-4">{r.recommended_service}</td>
                      <td className="py-2 pr-4">{formatDecisionDate(r.decided_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRecommendationsPage;
