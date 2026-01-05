import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { fetchStaffSchedule } from "../api/siadAPI";

interface StaffSchedule {
  week: number;
  staff_id: string;
  staff_name: string;
  role: string;
  service: string;
  present: number;
}

const StaffScheduleTable = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<StaffSchedule[]>([]);

  useEffect(() => {
    if (user && user.staff_id) {
      fetchStaffSchedule().then(data => {
        setSchedule(data);
      });
    }
  }, [user]);

  return (
    <div>
      <h2>Staff Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Staff ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Service</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((s, index) => (
            <tr key={index}>
              <td>{s.week}</td>
              <td>{s.staff_id}</td>
              <td>{s.staff_name}</td>
              <td>{s.role}</td>
              <td>{s.service}</td>
              <td>{s.present}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffScheduleTable;
