import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import PatientsTable from "./components/PatientsTable";

import PatientsListPage from "./pages/admin/PatientsListPage";
import ServicesWeeklyListPage from "./pages/admin/ServicesWeeklyListPage";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffListPage from "./pages/admin/StaffListPage";
import StaffSchedulePage from "./pages/admin/StaffSchedulePage";




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
            <PatientsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/list"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StaffListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff-schedule"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]}>
            <StaffSchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services-weekly"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ServicesWeeklyListPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </Router>
);

export default App;
