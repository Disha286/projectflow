import API from '../utils/axios';

export const registerAPI = (data) => API.post('/auth/register', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const logoutAPI = () => API.post('/auth/logout');
export const getMeAPI = () => API.get('/auth/me');
export const forgotPasswordAPI = (data) => API.post('/auth/forgot-password', data);
export const resetPasswordAPI = (token, data) => API.post(`/auth/reset-password/${token}`, data);
export const verifyEmailAPI = (token) => API.get(`/auth/verify-email/${token}`);