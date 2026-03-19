import API from '../utils/axios';

export const createSprintAPI = (projectId, data) => API.post(`/sprints/project/${projectId}`, data);
export const getSprintsAPI = (projectId) => API.get(`/sprints/project/${projectId}`);
export const updateSprintAPI = (sprintId, data) => API.put(`/sprints/${sprintId}`, data);
export const startSprintAPI = (sprintId) => API.post(`/sprints/${sprintId}/start`);
export const completeSprintAPI = (sprintId) => API.post(`/sprints/${sprintId}/complete`);
export const deleteSprintAPI = (sprintId) => API.delete(`/sprints/${sprintId}`);