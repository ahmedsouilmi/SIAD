import TableWrapper from "../../components/ui/TableWrapper";
import ServicesWeeklyChart from "../../components/ServicesWeeklyChart";
import { useAuth } from "../../components/AuthContext";
import { useEffect, useState } from "react";
import { fetchPatients } from "../../api/siadAPI";
import StaffTopNav from "../../components/layout/StaffTopNav";

interface Patient {
  patient_id: string;
  name: string;
  age: number;
  arrival_date: string;
  departure_date: string;
  service: string;
  satisfaction: number;
}


const StaffPatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPatients().then(data => {
      // Filter patients by staff's service if available
      if (user && user.service) {
        setPatients(data.filter((p: Patient) => p.service === user.service));
      } else {
        setPatients([]);
      }
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <StaffTopNav />
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">My Service Weekly Stats</h1>
        <ServicesWeeklyChart />
        <TableWrapper title="My Patients">
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          ) : patients.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No patients found for your service.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Age</th>
                    <th className="px-4 py-2">Arrival</th>
                    <th className="px-4 py-2">Departure</th>
                    <th className="px-4 py-2">Service</th>
                    <th className="px-4 py-2">Satisfaction</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.patient_id} className="border-t">
                      <td className="px-4 py-2">{p.patient_id}</td>
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.age}</td>
                      <td className="px-4 py-2">{p.arrival_date}</td>
                      <td className="px-4 py-2">{p.departure_date}</td>
                      <td className="px-4 py-2">{p.service}</td>
                      <td className="px-4 py-2">{p.satisfaction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TableWrapper>
      </div>
    </div>
  );
};

export default StaffPatientsPage;
