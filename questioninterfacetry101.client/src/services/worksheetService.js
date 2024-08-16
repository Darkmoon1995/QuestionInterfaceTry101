import axios from 'axios';

const API_URL = 'http://localhost:7226/api/worksheet';

export const getWorksheets = async () => {
    try {
        const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        console.error('Error fetching worksheets', error);
        throw error;
    }
};

export const getWorksheet = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        console.error('Error fetching worksheet', error);
        throw error;
    }
};

export const createWorksheet = async (worksheet) => {
    try {
        const response = await axios.post(API_URL, worksheet, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        return response.data;
    } catch (error) {
        console.error('Error creating worksheet', error);
        throw error;
    }
};
