import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://budget-tracker-backend-9v7m.onrender.com';

const api = axios.create({
    baseURL: 'https://budget-tracker-backend-9v7m.onrender.com',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const generalApi = api;

export const aiApi = {
    getOverview: (token) =>
        axios.get(`${API_URL}/api/ai/overview`, {
            headers: { Authorization: `Bearer ${token}` },
        }),

    getForecast: (data, token) =>
        axios.post(`${API_URL}/api/ai/forecast`, data, {
            headers: { Authorization: `Bearer ${token}` },
        }),

    getAdvice: (data, token) =>
        axios.post(`${API_URL}/api/ai/advice`, data, {
            headers: { Authorization: `Bearer ${token}` },
        }),
};

export default api;