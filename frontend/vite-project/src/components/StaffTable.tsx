import { useEffect, useState } from "react";
import { fetchStaff } from "../api/siadAPI";

interface Staff {
  staff_id: string;
  staff_name: string;
  role: string;
  service: string;
}

const StaffTable = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);

  useEffect(() => {
    fetchStaff().then(data => setStaffList(data));
  }, []);

  return (
    <div>
      <h2>Hospital Staff</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Service</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map(s => (
            <tr key={s.staff_id}>
              <td>{s.staff_id}</td>
              <td>{s.staff_name}</td>
              <td>{s.role}</td>
              <td>{s.service}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
