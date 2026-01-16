import api from '../api';

const memberService = {
    getAllMembers: async (page = 1, search = '') => {
        const response = await api.get('/members', {
            params: { 
                page: page,
                search: search 
            }
        });
        return response.data;
    },

    getMemberById: async (id) => {
        const response = await api.get(`/members/${id}`);
        return response.data;
    },

    createMember: async (memberData) => {
        const response = await api.post('/members', memberData, {
        headers: { 'Content-Type': 'multipart/form-data'},
    });
        return response.data;
    },

    updateMember: async (id, memberData) => {
        const response = await api.put(`/members/${id}`, memberData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
        return response.data;
    },

    deleteMember: async (id) => {
        const response = await api.delete(`/members/${id}`);
        return response.data;
    }
};

export default memberService;