import axios from 'axios'
const API_URL = 'http://localhost:4000/users/'

const fetchAllProfiles = async (sortByCompatibility = false) => {
    const token = localStorage.getItem('token')
    if (!token) {
        console.log('No token found');
        return []
    }
    try {
        const params = sortByCompatibility ? { sortBy: 'compatibility' } : {};
        const response = await axios.get(`${API_URL}fetch-allusers`, {
            params,
            headers: {
                'Authorization': `Bearer ${token}`
            }

        })
        return response.data
    } catch (error) {
        console.log('Server not responded');
        return []
    }
}
export { fetchAllProfiles }