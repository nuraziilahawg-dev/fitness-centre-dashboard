import api from '../api';

const authService = {
    login: async (userData) => {
        const response = await api.post('/login', userData);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/register', userData);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/user');
        return response.data;
    }
};

export default authService;