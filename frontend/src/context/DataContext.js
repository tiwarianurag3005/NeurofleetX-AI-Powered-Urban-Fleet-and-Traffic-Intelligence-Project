import { createContext, useState, useContext, useEffect } from 'react';
import AuthContext from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [bookings, setBookings] = useState([]);
    const { token } = useContext(AuthContext);

    const API_BASE_URL = 'http://localhost:8080/api';

    // Fetch public courses
    const fetchPublicCourses = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/public`);
            if (response.ok) {
                const data = await response.json();
                setCourses(data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // Fetch user bookings
    const fetchUserBookings = async () => {
        if (!token) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    // Create a new booking
    const createBooking = async (bookingData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(bookingData),
            });

            if (response.ok) {
                const newBooking = await response.json();
                setBookings(prev => [...prev, newBooking]);
                return { success: true, data: newBooking };
            } else {
                const error = await response.json();
                return { success: false, error: error.message };
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            return { success: false, error: 'Network error' };
        }
    };

    useEffect(() => {
        fetchPublicCourses();
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserBookings();
        }
    }, [token]);

    const value = {
        courses,
        bookings,
        fetchPublicCourses,
        fetchUserBookings,
        createBooking
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export default DataContext;