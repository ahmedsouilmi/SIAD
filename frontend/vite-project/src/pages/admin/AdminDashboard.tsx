import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import CardKPI from "../../components/ui/CardKPI";
import ChartWrapper from "../../components/ui/ChartWrapper";
import ServicesWeeklyChart from "../../components/ServicesWeeklyChart";
import Sidebar from "../../components/layout/Sidebar";
import { fetchKpisSummary, fetchKpisByService, fetchKpisTrends, fetchStaff, fetchPatients } from "../../api/siadAPI";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

interface KpisSummary {
    total_patients: number;
    patients_admitted: number;
    patients_refused: number;
    avg_satisfaction: number;
    avg_staff_morale: number;
}

interface ServiceKpi {
    service: string;
    admitted: number;
    refused: number;
    avg_beds: number;
}

interface TrendKpi {
    month: number;
    week: number;
    admitted: number;
    refused: number;
    avg_satisfaction: number;
    avg_morale: number;
}

const AdminDashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState<KpisSummary | null>(null);
    const [serviceKpis, setServiceKpis] = useState<ServiceKpi[]>([]);
    const [trends, setTrends] = useState<TrendKpi[]>([]);
    const [staffCount, setStaffCount] = useState<number>(0);
    const [patientCount, setPatientCount] = useState<number>(0);

    useEffect(() => {
        fetchKpisSummary().then(setSummary).catch(console.error);
        fetchKpisByService().then(setServiceKpis).catch(console.error);
        fetchKpisTrends().then(setTrends).catch(console.error);
        fetchStaff().then(data => setStaffCount(data.length)).catch(console.error);
        fetchPatients().then(data => setPatientCount(data.length)).catch(console.error);
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar />
            <main style={{ marginLeft: 240, flex: 1, padding: '2rem 2.5rem' }}>
                <div className="mb-4">
                    <h1 className="h3 fw-bold">Bonjour{user?.username ? `, Dr. ${user.username}` : ''}</h1>
                    <div className="text-muted" style={{ fontSize: '1rem' }}>Voici un aperçu de l'activité hospitalière</div>
                </div>

                {/* KPI Cards */}
                                <div
                                    className="d-flex mb-4 justify-content-start align-items-stretch"
                                    style={{
                                        width: '100%',
                                        gap: '1.5rem',
                                        flexWrap: 'nowrap',
                                        overflowX: 'auto',
                                        minHeight: '160px',
                                    }}
                                >
                                    <div style={{display: 'flex', gap: '1.5rem', width: '100%'}}>
                                        <CardKPI title="Personnel actif" value={staffCount} small={`Nombre du personnel actifs`} delta="+5% vs. hier" deltaType="up" />
                                        <CardKPI title="Patients" value={patientCount} small="Nombre total de patients" />
                                        <CardKPI title="Taux d'occupation" value={summary ? `${Math.round((summary.patients_admitted / (summary.total_patients || 1)) * 100)}%` : '—'} small="Pourcentage moyen d'occupation" delta="-3% vs. semaine" deltaType="down" />
                                        <CardKPI title="Satisfaction" value={summary ? summary.avg_satisfaction.toFixed(2) : '—'} small="Score de satisfaction" />
                                    </div>
                                </div>

                {/* Charts Row */}
                <div className="row mb-4 g-4">
                    <div className="col-md-6">
                        <ChartWrapper title="Patients Admis vs Refusés par Service">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={serviceKpis}>
                                    <XAxis dataKey="service" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="admitted" fill="#34d399" name="Admis" />
                                    <Bar dataKey="refused" fill="#f87171" name="Refusés" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                    </div>
                    <div className="col-md-6">
                        <ChartWrapper title="Tendances : Satisfaction & Morale">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" label={{ value: 'Semaine', position: 'insideBottomRight', offset: -5 }} />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="avg_satisfaction" stroke="#60a5fa" name="Satisfaction" />
                                    <Line type="monotone" dataKey="avg_morale" stroke="#facc15" name="Morale" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartWrapper>
                    </div>
                </div>

                {/* Weekly Services Overview */}
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <ChartWrapper title="Aperçu hebdomadaire des services">
                            <ServicesWeeklyChart />
                        </ChartWrapper>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
