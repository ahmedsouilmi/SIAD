
import React, { useEffect, useState } from "react";
import CardKPI from "../../components/ui/CardKPI";

import { fetchKpisWeeklyRaw } from "../../api/siadAPI";



const StaffKpiCards = () => {
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKpisWeeklyRaw().then(data => {
      setWeeklyData(data || []);
      if (data && data.length > 0) {
        setSelectedWeek(data[0].week); // default to first week
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="py-4">Loading KPIs...</div>;
  if (!weeklyData || weeklyData.length === 0) return <div className="py-4 text-gray-500">No KPI data found for your service.</div>;

  // Get unique weeks for dropdown
  const weeks = Array.from(new Set(weeklyData.map((d) => d.week))).sort((a, b) => a - b);
  const selectedKpi = weeklyData.find((d) => d.week === selectedWeek);

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="week-select" className="font-medium text-gray-700">Select Week:</label>
        <select
          id="week-select"
          className="border rounded px-2 py-1"
          value={selectedWeek ?? ''}
          onChange={e => setSelectedWeek(Number(e.target.value))}
        >
          {weeks.map(week => (
            <option key={week} value={week}>Week {week}</option>
          ))}
        </select>
      </div>
      {selectedKpi ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CardKPI title="Service" value={selectedKpi.service} />
          <CardKPI title="Available Beds" value={selectedKpi.available_beds} />
          <CardKPI title="Patients Admitted" value={selectedKpi.patients_admitted} />
          <CardKPI title="Patients Refused" value={selectedKpi.patients_refused} />
          <CardKPI title="Patient Satisfaction" value={selectedKpi.patient_satisfaction} />
          <CardKPI title="Staff Morale" value={selectedKpi.staff_morale} />
          <CardKPI title="Special Event" value={selectedKpi.event || '-'} />
        </div>
      ) : (
        <div className="text-gray-500">No data for selected week.</div>
      )}
    </div>
  );
};

export default StaffKpiCards;
