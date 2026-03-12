import API from '../utils/axios';

export const createProjectAPI = (data) => API.post('/projects', data);
export const getProjectsAPI = (workspaceId) => API.get(`/projects/workspace/${workspaceId}`);
export const getProjectAPI = (id) => API.get(`/projects/${id}`);
export const updateProjectAPI = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProjectAPI = (id) => API.delete(`/projects/${id}`);
export const getLabelsAPI = (id) => API.get(`/projects/${id}/labels`);
export const createLabelAPI = (id, data) => API.post(`/projects/${id}/labels`, data);