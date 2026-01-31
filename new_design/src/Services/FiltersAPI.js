import axios from 'axios'
const API_URL = 'http://localhost:4000/users/'

const FilterQualification = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        console.log('No token found');
    }
    try {
        const response = await axios.get(`${API_URL}get-filterQualification`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log('Server not responded');
    }
}

const FilterDesignation = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
        console.log('No token found');
        return { success: false, message: 'No token' };
    }
    try {
        const response = await axios.get(`${API_URL}get-filterDesignation`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log('Server not responded');
        return { success: false, error };
    }
}

export { FilterQualification, FilterDesignation }