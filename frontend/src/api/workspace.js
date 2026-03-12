import API from '../utils/axios';

export const createWorkspaceAPI = (data) => API.post('/workspaces', data);
export const getWorkspacesAPI = () => API.get('/workspaces');
export const getWorkspaceAPI = (id) => API.get(`/workspaces/${id}`);
export const updateWorkspaceAPI = (id, data) => API.put(`/workspaces/${id}`, data);
export const deleteWorkspaceAPI = (id) => API.delete(`/workspaces/${id}`);
export const getMembersAPI = (id) => API.get(`/workspaces/${id}/members`);
export const inviteMemberAPI = (id, data) => API.post(`/workspaces/${id}/invite`, data);
export const removeMemberAPI = (id, userId) => API.delete(`/workspaces/${id}/members/${userId}`);
export const updateMemberRoleAPI = (id, userId, data) => API.put(`/workspaces/${id}/members/${userId}/role`, data);
export const joinWorkspaceAPI = (token) => API.post(`/workspaces/join/${token}`);