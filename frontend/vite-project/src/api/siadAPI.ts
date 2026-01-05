import api from "./axiosConfig";

export const fetchServicesWeeklyForStaff = async () => {
  const res = await api.get("/services_weekly/staff");
  return res.data;
};

export const fetchPatients = async () => {
  const res = await api.get("/patients");
  return res.data;
};

export const fetchStaff = async () => {
  const res = await api.get("/staff");
  return res.data;
};

export const fetchServicesWeekly = async () => {
  const res = await api.get("/services_weekly");
  return res.data;
};

export const fetchStaffSchedule = async () => {
  const res = await api.get("/staff_schedule/me");
  return res.data;
};

export const fetchKpisSummary = async () => {
  const res = await api.get("/kpis/summary");
  return res.data;
};

export const fetchKpisByService = async () => {
  const res = await api.get("/kpis/by_service");
  return res.data;
};

export const fetchKpisTrends = async () => {
  const res = await api.get("/kpis/trends");
  return res.data;
};

export const fetchKpisWeeklyRaw = async () => {
  const res = await api.get("/kpis/weekly_raw");
  return res.data;
};

export const fetchWeeklyRecommendations = async (week?: number) => {
  const res = await api.get("/recommendations", { params: week ? { week } : undefined });
  return res.data;
};

export const approveRecommendation = async (id: number) => {
  const res = await api.post(`/recommendations/${id}/approve`);
  return res.data;
};

export const rejectRecommendation = async (id: number) => {
  const res = await api.post(`/recommendations/${id}/reject`);
  return res.data;
};

export const fetchMyApprovedRecommendations = async () => {
  const res = await api.get("/recommendations/me");
  return res.data;
};
