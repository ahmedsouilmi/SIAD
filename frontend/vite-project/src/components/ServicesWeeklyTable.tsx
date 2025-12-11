import { useEffect, useState } from "react";
import { fetchServicesWeekly } from "../api/siadAPI";

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
  const [services, setServices] = useState<ServiceWeekly[]>([]);

  useEffect(() => {
    fetchServicesWeekly().then(data => setServices(data));
  }, []);

  return (
    <div>
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
              <td>{s.staff_morale}</td>
              <td>{s.event}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesWeeklyTable;
