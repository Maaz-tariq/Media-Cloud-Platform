import api from '../api/axios';

export const getAllMedia = async () => {
    // Note: This will fail with a 401 Unauthorized until we add the Axios Interceptor!
    const response = await api.get('/media');
    return response.data;
};