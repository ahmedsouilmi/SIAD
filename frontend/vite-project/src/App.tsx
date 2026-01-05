import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import PatientsTable from "./components/PatientsTable";

import PatientsListPage from "./pages/admin/PatientsListPage";
import ServicesWeeklyListPage from "./pages/admin/ServicesWeeklyListPage";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffPatientsPage from "./pages/staff/StaffPatientsPage";
import StaffListPage from "./pages/admin/StaffListPage";
import StaffSchedulePage from "./pages/admin/StaffSchedulePage";
import MySchedulePage from "./pages/staff/MySchedulePage";
import WeeklyRecommendationsPage from "./pages/admin/WeeklyRecommendationsPage";
import MyRecommendationsPage from "./pages/staff/MyRecommendationsPage";




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
      {/* Admin sees all patients, staff see only their service's patients */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PatientsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/patients"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffPatientsPage />
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
          <ProtectedRoute allowedRoles={["staff"]}>
            <MySchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff-schedule"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StaffSchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/weekly-recommendations"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <WeeklyRecommendationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/recommendations"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <MyRecommendationsPage />
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
