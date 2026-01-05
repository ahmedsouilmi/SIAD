import React, { useEffect, useState } from "react";
import { fetchKpisWeeklyRaw } from "../../api/siadAPI";

const ServiceOverviewTable = () => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKpisWeeklyRaw().then(data => {
      setWeeklyData(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-4">Loading service overview...</div>;
  if (!weeklyData || weeklyData.length === 0) return <div className="py-4 text-gray-500">No service data found for your service.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Week</th>
            <th className="px-4 py-2">Patients Requested</th>
            <th className="px-4 py-2">Patients Admitted</th>
            <th className="px-4 py-2">Patients Refused</th>
            <th className="px-4 py-2">Available Beds</th>
            <th className="px-4 py-2">Special Event</th>
          </tr>
        </thead>
        <tbody>
          {weeklyData.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2 text-center">{row.week}</td>
              <td className="px-4 py-2 text-center">{row.patients_request}</td>
              <td className="px-4 py-2 text-center">{row.patients_admitted}</td>
              <td className="px-4 py-2 text-center">{row.patients_refused}</td>
              <td className="px-4 py-2 text-center">{row.available_beds}</td>
              <td className="px-4 py-2 text-center">{row.event || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceOverviewTable;
