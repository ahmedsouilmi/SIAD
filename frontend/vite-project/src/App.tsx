import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PatientsTable from "./components/PatientsTable";
import StaffTable from "./components/StaffTable";
import ServicesWeeklyTable from "./components/ServicesWeeklyTable";
import StaffScheduleTable from "./components/StaffScheduleTable";
import ServicesWeeklyChart from "./components/ServicesWeeklyChart";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";


import { useAuth } from "./components/AuthContext";
import { Link, useNavigate } from "react-router-dom";


const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-1">Admin Dashboard</h1>
        <div className="flex gap-4 items-center">
          {user && <span className="text-gray-600">{user.username} ({user.role})</span>}
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <nav className="mb-6 flex gap-4">
        <Link to="/admin">Dashboard</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/staff">Staff</Link>
        <Link to="/services-weekly">Services Analytics</Link>
        <Link to="/staff-schedule">Staff Schedule</Link>
      </nav>
      <ServicesWeeklyChart />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <PatientsTable />
        </div>
        <div className="bg-white rounded shadow p-4">
          <StaffTable />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded shadow p-4">
          <ServicesWeeklyTable />
        </div>
        <div className="bg-white rounded shadow p-4">
          <StaffScheduleTable />
        </div>
      </div>
    </div>
  );
};

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center flex-1">Staff Dashboard</h1>
        <div className="flex gap-4 items-center">
          {user && <span className="text-gray-600">{user.username} ({user.role})</span>}
          <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <nav className="mb-6 flex gap-4">
        <Link to="/staff">Dashboard</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/staff-schedule">My Schedule</Link>
        <Link to="/services-weekly">Service Info</Link>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <PatientsTable />
        </div>
        <div className="bg-white rounded shadow p-4">
          <StaffScheduleTable />
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]}>
            <PatientsTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-schedule"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]}>
            <StaffScheduleTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StaffTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services-weekly"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ServicesWeeklyTable />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default App;
