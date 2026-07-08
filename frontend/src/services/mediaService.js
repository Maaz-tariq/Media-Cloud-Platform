import api from '../api/axios';


export const getMedia = async (params) => {
    const response = await api.get('/media', { params }); 
    return response.data;
};

// working fine
export const uploadMedia = async (formData) => {
    const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// working fine
export const renameMedia = async (id, newName) => {
    const response = await api.patch(`/media/${id}/rename`, { name: newName });
    return response.data;
};

// working fine
export const deleteMedia = async (id) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
};


export const createShareLink = async (mediaId) => {
    const response = await api.post(`/media/${mediaId}/shares`, { 
        expiresInDays: null 
    });
    return response.data;
};


import axios from 'axios';
export const getShareMetadata = async (token) => {
    const response = await axios.get(`http://localhost:5000/api/public/shares/${token}`);
    return response.data;
};