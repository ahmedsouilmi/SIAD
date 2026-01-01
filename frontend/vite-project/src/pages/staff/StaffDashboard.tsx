import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import StaffProfile from "../../components/StaffProfile";
import ServicesWeeklyChart from "../../components/ServicesWeeklyChart";
import ServicesWeeklyTable from "../../components/ServicesWeeklyTable";
import StaffScheduleTable from "../../components/StaffScheduleTable";
import TableWrapper from "../../components/ui/TableWrapper";
import ChartWrapper from "../../components/ui/ChartWrapper";

const StaffDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4">Staff Dashboard</h1>
                <div>
                    {user && <span className="me-3 text-muted">{user.username} ({user.role})</span>}
                    <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mb-4">
                <Link className="me-3 fw-bold text-primary" to="/staff">Dashboard</Link>
                <Link className="me-3" to="/patients">Patients</Link>
                <Link className="me-3" to="/staff-schedule">My Schedule</Link>
                <Link className="me-3" to="/services-weekly">Service Info</Link>
            </nav>

            <div className="row">
                {/* Left Column: Personal Profile & Stats */}
                <div className="col-md-5 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <StaffProfile />
                        </div>
                    </div>
                </div>

                {/* Right Column: Service Overview */}
                <div className="col-md-7">
                    <div className="mb-4">
                        <ChartWrapper title="My Service Weekly Stats">
                            <ServicesWeeklyChart />
                        </ChartWrapper>
                    </div>

                    <div className="mb-4">
                        <TableWrapper title="My Information">
                            <StaffScheduleTable />
                        </TableWrapper>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <TableWrapper title="Detailed Service Reports">
                        <ServicesWeeklyTable />
                    </TableWrapper>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
