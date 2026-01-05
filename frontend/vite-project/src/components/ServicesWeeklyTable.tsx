import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { fetchServicesWeekly, fetchServicesWeeklyForStaff } from "../api/siadAPI";

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

const ServicesWeeklyTable = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<ServiceWeekly[]>([]);

  useEffect(() => {
    if (!user) {
      setServices([]);
      return;
    }
    if (user.role === "staff") {
      fetchServicesWeeklyForStaff().then(setServices).catch(() => setServices([]));
      return;
    }
    if (user.role === "admin") {
      fetchServicesWeekly().then(setServices).catch(() => setServices([]));
      return;
    }
    setServices([]);
  }, [user]);

  return (
    <div>
      {/* Scoped style for morale badge */}
      <style>{`
        .morale-badge {
          display: inline-block;
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
          color: #fff;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1rem;
          padding: 0.45rem 1.3rem;
          letter-spacing: 0.03em;
          box-shadow: 0 1px 4px 0 rgba(30,41,59,0.10);
          border: 2px solid #1e40af;
          outline: none;
          min-width: 2.7em;
          text-align: center;
          transition: background 0.2s, color 0.2s;
        }
      `}</style>
      <h2>Weekly Services</h2>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Month</th>
            <th>Service</th>
            <th>Available Beds</th>
            <th>Requests</th>
            <th>Admitted</th>
            <th>Refused</th>
            <th>Patient Satisfaction</th>
            <th>Staff Morale</th>
            <th>Event</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s, index) => (
            <tr key={index}>
              <td>{s.week}</td>
              <td>{s.month}</td>
              <td>{s.service}</td>
              <td>{s.available_beds}</td>
              <td>{s.patients_request}</td>
              <td>{s.patients_admitted}</td>
              <td>{s.patients_refused}</td>
              <td>{s.patient_satisfaction}</td>
              <td>{s.event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesWeeklyTable;
