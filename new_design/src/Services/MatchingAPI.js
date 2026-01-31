import axios from 'axios';

const API_URL = 'http://localhost:4000/users/';

/**
 * Get compatibility score between current user and another user
 * @param {String} userId - Target user ID
 * @returns {Object} - { success, score, breakdown, cached, calculatedAt }
 */
const getCompatibilityScore = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found');
        return { success: false, message: 'No authentication token' };
    }

    try {
        const response = await axios.get(`${API_URL}compatibility/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching compatibility score:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Server not responded'
        };
    }
};

/**
 * Get top compatible matches
 * @param {Number} limit - Number of matches to fetch (default: 20)
 * @returns {Object} - { success, count, matches }
 */
const getTopMatches = async (limit = 20) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found');
        return { success: false, message: 'No authentication token' };
    }

    try {
        const response = await axios.get(`${API_URL}top-matches`, {
            params: { limit },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching top matches:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Server not responded'
        };
    }
};

/**
 * Recalculate compatibility score (force refresh)
 * @param {String} userId - Target user ID
 * @returns {Object} - { success, score, breakdown, calculatedAt }
 */
const recalculateCompatibility = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found');
        return { success: false, message: 'No authentication token' };
    }

    try {
        const response = await axios.post(`${API_URL}recalculate-compatibility/${userId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error recalculating compatibility:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Server not responded'
        };
    }
};

export { getCompatibilityScore, getTopMatches, recalculateCompatibility };
