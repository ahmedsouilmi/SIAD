import StaffTopNav from "../../components/layout/StaffTopNav";
import StaffProfile from "../../components/StaffProfile";
import StaffKpiCards from "./StaffKpiCards";
import ServicesWeeklyChart from "../../components/ServicesWeeklyChart";
import ChartWrapper from "../../components/ui/ChartWrapper";

const StaffDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <StaffTopNav />

            <div className="container mx-auto px-4">
                <StaffKpiCards />

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Personal Profile & Stats */}
                    <div className="lg:w-5/12 w-full">
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <StaffProfile />
                        </div>
                    </div>
                    {/* Right Column: Service Overview */}
                    <div className="lg:w-7/12 w-full flex flex-col gap-6">
                        <ChartWrapper title="My Service Weekly Stats">
                            <ServicesWeeklyChart />
                        </ChartWrapper>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StaffDashboard;
