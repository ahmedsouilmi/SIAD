import api from "./axiosConfig";

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
  const res = await api.get("/staff_schedule");
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
