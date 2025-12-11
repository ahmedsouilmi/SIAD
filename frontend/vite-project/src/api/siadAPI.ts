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
