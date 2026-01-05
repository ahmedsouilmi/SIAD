
import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import { fetchServicesWeeklyForStaff } from "../api/siadAPI";

interface Me {
  id?: number;
  username?: string;
  staff_id?: string;
  staff_name?: string;
  role?: string;
  service?: string;
}

const StaffProfile: React.FC = () => {
  const { user } = useAuth();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    if (user) {
      setMe(user as Me);
      // Keep fetching service KPI data if other pages/components depend on it later.
      // (No UI rendered for it here.)
      fetchServicesWeeklyForStaff().catch(() => undefined);
    }
  }, [user]);

  return (
    <div>
      <div className="mb-4">
        <h4>My Profile</h4>
        {me ? (
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Staff ID: {me.staff_id || user?.staff_id || '—'}</li>
            <li className="list-group-item">Name: {me.staff_name || user?.staff_name || me.username || user?.username || '—'}</li>
            <li className="list-group-item">Role: {me.role || user?.role || '—'}</li>
            <li className="list-group-item">Service: {me.service || user?.service || '—'}</li>
          </ul>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default StaffProfile;
