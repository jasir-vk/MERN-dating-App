import axios from 'axios';

const API_URL = 'http://localhost:4000/users/';

const getForYouFeed = async (limit = 20) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found');
    return { success: false, message: 'No token' };
  }

  try {
    const response = await axios.get(`${API_URL}for-you-feed?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log('Server not responded');
    return { success: false, error };
  }
};

const recordSwipe = async (profileId, action) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found');
    return { success: false, message: 'No token' };
  }

  try {
    const response = await axios.post(
      `${API_URL}record-swipe`,
      { profileId, action },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log('Failed to record swipe');
    return { success: false, error };
  }
};

const undoSwipe = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found');
    return { success: false, message: 'No token' };
  }

  try {
    const response = await axios.post(
      `${API_URL}undo-swipe`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log('Failed to undo swipe');
    return { success: false, error };
  }
};

const trackProfileView = async (profileId, duration = 0, source = 'unknown') => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found');
    return { success: false, message: 'No token' };
  }

  try {
    const response = await axios.post(
      `${API_URL}track-profile-view`,
      { profileId, duration, source },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log('Failed to track profile view');
    return { success: false, error };
  }
};

export { getForYouFeed, recordSwipe, undoSwipe, trackProfileView };
