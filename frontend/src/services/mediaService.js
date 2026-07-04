import api from '../api/axios';

export const getMedia = async (options = {}) => {
    const response = await api.get('/media', { params: options });
    return response.data;
};

export const uploadMedia = async (formData) => {
    const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};


export const renameMedia = async (id, newName) => {
    const response = await api.patch(`/media/${id}/rename`, { name: newName });
    return response.data;
};

export const deleteMedia = async (id) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
};

export const createShareLink = async (id, data = {}) => {
    const response = await api.post(`/media/${id}/share`, data); 
    return response.data;
};