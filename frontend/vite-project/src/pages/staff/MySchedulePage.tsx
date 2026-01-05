import { useEffect, useMemo, useState } from "react";
import { fetchStaffSchedule } from "../../api/siadAPI";
import StaffTopNav from "../../components/layout/StaffTopNav";

interface StaffScheduleRow {
  week: number;
  staff_id: string;
  staff_name: string;
  role: string;
  service: string;
  present: number;
}

const MySchedulePage = () => {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<StaffScheduleRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStaffSchedule();
        if (cancelled) return;
        setSchedule((data || []) as StaffScheduleRow[]);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.response?.data?.detail || e?.message || "Failed to load schedule");
        setSchedule([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...schedule].sort((a, b) => (a.week ?? 0) - (b.week ?? 0));
  }, [schedule]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffTopNav />

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">My Schedule</h2>

          {loading && <div className="py-4 text-gray-500">Loading schedule...</div>}
          {!loading && error && <div className="py-4 text-red-600">{error}</div>}
          {!loading && !error && sorted.length === 0 && (
            <div className="py-4 text-gray-500">No schedule data found.</div>
          )}

          {!loading && !error && sorted.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2 pr-4">Week</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Service</th>
                    <th className="py-2 pr-4">Present</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row) => (
                    <tr key={`${row.week}-${row.staff_id}`} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">{row.week}</td>
                      <td className="py-2 pr-4">{row.staff_name}</td>
                      <td className="py-2 pr-4">{row.role}</td>
                      <td className="py-2 pr-4">{row.service}</td>
                      <td className="py-2 pr-4">{row.present}</td>
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

export default MySchedulePage;
