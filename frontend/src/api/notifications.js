import API from '../utils/axios';

export const getNotificationsAPI = (params) => API.get('/notifications', { params });
export const markAsReadAPI = (id) => API.patch(`/notifications/${id}/read`);
export const markAllAsReadAPI = () => API.patch('/notifications/read-all');
export const deleteNotificationAPI = (id) => API.delete(`/notifications/${id}`);