import { useEffect, useState } from "react";
import { fetchServicesWeekly } from "../api/siadAPI";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ServiceWeekly {
  week: number;
  service: string;
  patients_admitted: number;
  patients_refused: number;
  patient_satisfaction: number;
  staff_morale: number;
}

const ServicesWeeklyChart = () => {
  const [data, setData] = useState<ServiceWeekly[]>([]);

  useEffect(() => { fetchServicesWeekly().then(d => setData(d)); }, []);

  return (
    <div className="my-8 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Weekly Services Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="service" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="patients_admitted" fill="#34d399" />
          <Bar dataKey="patients_refused" fill="#f87171" />
          <Bar dataKey="patient_satisfaction" fill="#60a5fa" />
          <Bar dataKey="staff_morale" fill="#facc15" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServicesWeeklyChart;
