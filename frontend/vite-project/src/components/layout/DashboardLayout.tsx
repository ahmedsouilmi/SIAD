import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }}>
                {/* Top Header */}
                <TopHeader />

                {/* Page Content */}
                <main style={{ flex: 1, padding: '2rem' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
