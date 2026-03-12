import API from '../utils/axios';

export const createTaskAPI = (data) => API.post('/tasks', data);
export const getProjectTasksAPI = (projectId, params) => API.get(`/tasks/project/${projectId}`, { params });
export const getMyTasksAPI = () => API.get('/tasks/my');
export const getTaskAPI = (id) => API.get(`/tasks/${id}`);
export const updateTaskAPI = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTaskAPI = (id) => API.delete(`/tasks/${id}`);
export const updateTaskStatusAPI = (id, status) => API.patch(`/tasks/${id}/status`, { status });
export const addCommentAPI = (id, data) => API.post(`/tasks/${id}/comments`, data);
export const deleteCommentAPI = (taskId, commentId) => API.delete(`/tasks/${taskId}/comments/${commentId}`);
export const addSubTaskAPI = (id, data) => API.post(`/tasks/${id}/subtasks`, data);
export const updateSubTaskAPI = (taskId, subTaskId, data) => API.put(`/tasks/${taskId}/subtasks/${subTaskId}`, data);
export const searchTasksAPI = (params) => API.get('/tasks/search', { params });