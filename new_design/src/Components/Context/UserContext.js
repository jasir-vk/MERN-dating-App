import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import LoadingPage from '../LoadingPage/LoadingPage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetched, setFetched] = useState(false); // Flag to prevent multiple fetches

    const fetchUserDetails = useCallback(async (token) => {
        console.log("My token:", token);
        if (!token) {
            console.error('No token provided to fetchUserDetails');
            return null;
        }

        try {
            const response = await axios.get('http://localhost:4000/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setUser(response.data.user);
                setFetched(true);  // Set fetched flag to true
                return response.data.user;  // Return the user data here
            } else {
                setError('Failed to fetch user details');
                return null;
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                setUser(null);
                setError('Session expired. Please login again.');
            } else {
                setError('Error fetching user details');
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !fetched) {  // Only fetch if not already fetched
            fetchUserDetails(token);
        } else {
            setLoading(false);
        }
    }, [fetched, fetchUserDetails]);  // Depend on fetched and fetchUserDetails

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
        setFetched(false);
        // Components using this function should handle navigation themselves
    }

    return (
        <UserContext.Provider value={{ user, loading, error, fetchUserDetails, logout }}>
            {loading ? <LoadingPage /> : children}
        </UserContext.Provider>
    );
};
