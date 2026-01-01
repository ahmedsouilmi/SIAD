import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import TableWrapper from "./ui/TableWrapper";

interface Me {
  id?: number;
  username?: string;
  staff_id?: string;
  role?: string;
  service?: string;
}

const StaffProfile: React.FC = () => {
  const [me, setMe] = useState<Me | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [serviceKpis, setServiceKpis] = useState<any[]>([]);

  useEffect(() => {
    api.get("/me").then((r) => setMe(r.data)).catch(() => setMe(null));
    api.get("/staff_schedule").then((r) => setSchedule(r.data)).catch(() => setSchedule([]));
    api.get("/kpis/by_service").then((r) => setServiceKpis(r.data)).catch(() => setServiceKpis([]));
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h4>My Profile</h4>
        {me ? (
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Staff ID: {me.staff_id || '—'}</li>
            <li className="list-group-item">Name: {me.username || '—'}</li>
            <li className="list-group-item">Role: {me.role || '—'}</li>
            <li className="list-group-item">Service: {me.service || '—'}</li>
          </ul>
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <div className="mb-4">
        <h5>My Weekly Presence</h5>
        <TableWrapper>
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Week</th>
                <th>Present</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s) => (
                <tr key={s.id}>
                  <td>{s.week}</td>
                  <td>{s.present}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </div>

      <div>
        <h5>Service Overview</h5>
        <TableWrapper>
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Service</th>
                <th>Admitted</th>
                <th>Refused</th>
                <th>Avg Beds</th>
              </tr>
            </thead>
            <tbody>
              {serviceKpis.map((s) => (
                <tr key={s.service}>
                  <td>{s.service}</td>
                  <td>{s.admitted}</td>
                  <td>{s.refused}</td>
                  <td>{s.avg_beds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </div>
  );
};

export default StaffProfile;
