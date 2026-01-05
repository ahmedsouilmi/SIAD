import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

interface DashboardLayoutProps {
  children: ReactNode;
}

const SIDEBAR_WIDTH = 240;

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: window.innerWidth >= 992 ? SIDEBAR_WIDTH : 0,
          transition: "margin-left 0.3s ease",
          width: "100%",
        }}
      >
        {/* Top Header */}
        <TopHeader toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="flex-grow-1 p-4 p-lg-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
