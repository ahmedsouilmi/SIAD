import { useEffect, useState } from "react";
import { fetchPatients } from "../api/siadAPI";

interface Patient {
  patient_id: string;
  name: string;
  age: number;
  arrival_date: string;
  departure_date: string;
  service: string;
  satisfaction: number;
}

const PatientsTable = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    fetchPatients().then(data => setPatients(data));
  }, []);

  return (
    <div>
      <h2>Patients</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Arrival</th>
            <th>Departure</th>
            <th>Service</th>
            <th>Satisfaction</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.patient_id}>
              <td>{p.patient_id}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.arrival_date}</td>
              <td>{p.departure_date}</td>
              <td>{p.service}</td>
              <td>{p.satisfaction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsTable;
