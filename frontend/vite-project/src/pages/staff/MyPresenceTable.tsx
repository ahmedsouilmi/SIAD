import React, { useEffect, useState } from "react";
import { fetchStaffSchedule } from "../../api/siadAPI";

const MyPresenceTable = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffSchedule().then(data => {
      setSchedule(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-4">Loading your presence...</div>;
  if (!schedule || schedule.length === 0) return <div className="py-4 text-gray-500">No presence data found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Week</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Presence</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2 text-center">{row.week}</td>
              <td className="px-4 py-2 text-center">{row.staff_name}</td>
              <td className="px-4 py-2 text-center">{row.role}</td>
              <td className="px-4 py-2 text-center">
                {row.present ? <span className="text-green-600 font-semibold">Present</span> : <span className="text-red-600 font-semibold">Absent</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyPresenceTable;
