import axios from "axios";
const BASE = process.env.BASE_URL || "http://localhost:5001/api";

//employee api connect
export const fetchEmployees = () => axios.get(`${BASE}/employee`);
export const addEmployee = (data) =>axios.post(`${BASE}/employee`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const updateEmployee = (id, data) =>axios.put(`${BASE}/employee/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteEmployee = (id) => axios.delete(`${BASE}/employee/${id}`);

//department api connect
export const fetchDepartments = () => axios.get(`${BASE}/department`);
export const addDepartment = (data) => axios.post(`${BASE}/department`, data);
export const updateDepartment = (id, data) => axios.put(`${BASE}/department/${id}`, data);
export const deleteDepartment = (id) => axios.delete(`${BASE}/department/${id}`);

//designation api connect
export const fetchDesignations = (depId) =>axios.get(`${BASE}/designation`, depId ? { params: { departmentId: depId } } : {});
export const addDesignation = (data) => axios.post(`${BASE}/designation`, data);
export const updateDesignation = (id, data) => axios.put(`${BASE}/designation/${id}`, data);
export const deleteDesignation = (id) => axios.delete(`${BASE}/designation/${id}`);
