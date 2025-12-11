import PatientsTable from "./components/PatientsTable";
import StaffTable from "./components/StaffTable";
import ServicesWeeklyTable from "./components/ServicesWeeklyTable";
import StaffScheduleTable from "./components/StaffScheduleTable";
import ServicesWeeklyChart from "./components/ServicesWeeklyChart";

function App() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">SIAD Hospital Dashboard</h1>

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
}

export default App;
