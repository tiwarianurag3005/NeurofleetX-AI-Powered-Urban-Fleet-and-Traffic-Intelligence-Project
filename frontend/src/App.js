import React, { useState, useEffect } from 'react';
import AuthContext from './context/AuthContext';
import DataContext from './context/DataContext';

// Component Imports from new locations
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import PassengerHomePage from './components/passenger/PassengerHomePage';
import ConfirmRidePage from './components/passenger/ConfirmRidePage';
import TrackingPage from './components/passenger/TrackingPage';
import ProfilePage from './components/passenger/ProfilePage';
import FleetOwnerDashboard from './components/fleet/FleetOwnerDashboard';

export default function App() {
    // --- State Management ---
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]); // Database of all registered users
    const [page, setPage] = useState('login'); // login, signup, passenger, fleet, confirm, tracking, profile
    const [vehicles, setVehicles] = useState([]);
    const [rides, setRides] = useState([]);
    const [scheduledRides, setScheduledRides] = useState([]);
    const [currentRide, setCurrentRide] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = 'http://localhost:8080/api';

    // --- Effects to load data from localStorage on initial render ---
    useEffect(() => {
        const storedScheduledRides = JSON.parse(localStorage.getItem('neurofleetx_scheduled_rides'));
        if (storedScheduledRides) {
            setScheduledRides(storedScheduledRides);
        }

        // Check if user is already logged in via token
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('neurofleetx_user');
        
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            verifyToken(token);
        }
    }, []);

    // --- Token Verification ---
    const verifyToken = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setPage(userData.role === 'Passenger' ? 'passenger' : 'fleet');
            } else {
                logout();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
        }
    };

    // --- Updated Authentication Functions with Backend Connection ---
    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('neurofleetx_user', JSON.stringify(data.user));
                
                setUser(data.user);
                setPage(data.user.role === 'Passenger' ? 'passenger' : 'fleet');
                return { success: true, message: data.message };
            } else {
                return { 
                    success: false, 
                    message: data.error || 'Invalid email or password.' 
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: 'Network error. Please check if the server is running.' 
            };
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role
                }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('neurofleetx_user', JSON.stringify(data.user));
                
                setUser(data.user);
                setPage(data.user.role === 'Passenger' ? 'passenger' : 'fleet');
                return { success: true, message: data.message };
            } else {
                return { 
                    success: false, 
                    message: data.error || 'Registration failed.' 
                };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { 
                success: false, 
                message: 'Network error. Please check if the server is running.' 
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('neurofleetx_user');
        setUser(null);
        setPage('login');
    };

    // --- Data Management Functions (Keep your existing logic) ---
    const addVehicle = (vehicleData) => {
        const newVehicles = [...vehicles, { ...vehicleData, id: Date.now(), status: 'Idle', ownerEmail: user.email }];
        localStorage.setItem('neurofleetx_vehicles', JSON.stringify(newVehicles));
        setVehicles(newVehicles);
    };
    
    const addScheduledRide = (rideData) => {
        const newScheduledRides = [...scheduledRides, { ...rideData, id: Date.now(), status: 'Scheduled' }];
        setScheduledRides(newScheduledRides);
        localStorage.setItem('neurofleetx_scheduled_rides', JSON.stringify(newScheduledRides));
    };

    const removeVehicle = (id) => {
        const newVehicles = vehicles.filter(v => v.id !== id);
        localStorage.setItem('neurofleetx_vehicles', JSON.stringify(newVehicles));
        setVehicles(newVehicles);
    };

    const startRide = (rideDetails) => {
        const availableVehicle = vehicles.find(v => 
            v.status === 'Idle' && 
            v.type === rideDetails.route.vehicleType &&
            v.capacity >= rideDetails.route.passengerCount
        );

        if (!availableVehicle) {
            console.error("No matching available vehicles.");
            return;
        }

        const newRide = { 
            ...rideDetails, 
            id: Date.now(), 
            passenger: user.name,
            driver: availableVehicle.driver, 
            vehicleId: availableVehicle.id, 
            status: 'In Progress', 
            date: new Date().toISOString().split('T')[0] 
        };
        const updatedRides = [...rides, newRide];
        localStorage.setItem('neurofleetx_rides', JSON.stringify(updatedRides));
        setRides(updatedRides);

        const updatedVehicles = vehicles.map(v => 
            v.id === availableVehicle.id ? { ...v, status: 'On Ride'} : v
        );
        localStorage.setItem('neurofleetx_vehicles', JSON.stringify(updatedVehicles));
        setVehicles(updatedVehicles);

        setCurrentRide(newRide);
        setPage('tracking');
    };

    const completeRide = (rideToComplete) => {
        if (!rideToComplete) return;
        const updatedRides = rides.map(r => r.id === rideToComplete.id ? { ...r, status: 'Completed' } : r);
        localStorage.setItem('neurofleetx_rides', JSON.stringify(updatedRides));
        setRides(updatedRides);

        const updatedVehicles = vehicles.map(v =>
            v.id === rideToComplete.vehicleId ? { ...v, status: 'Idle' } : v
        );
        localStorage.setItem('neurofleetx_vehicles', JSON.stringify(updatedVehicles));
        setVehicles(updatedVehicles);
        
        if (currentRide && currentRide.id === rideToComplete.id) {
            setCurrentRide(null);
        }
    };

    const cancelRide = () => {
        if (!currentRide) return;
        const updatedRides = rides.map(r => r.id === currentRide.id ? { ...r, status: 'Cancelled' } : r);
        localStorage.setItem('neurofleetx_rides', JSON.stringify(updatedRides));
        setRides(updatedRides);

        const updatedVehicles = vehicles.map(v =>
            v.id === currentRide.vehicleId ? { ...v, status: 'Idle' } : v
        );
        localStorage.setItem('neurofleetx_vehicles', JSON.stringify(updatedVehicles));
        setVehicles(updatedVehicles);

        setCurrentRide(null);
        setPage('passenger');
    };

    // --- Context Providers ---
    const authContextValue = { user, login, signup, logout, loading };
    const dataContextValue = { 
        vehicles, 
        addVehicle, 
        removeVehicle, 
        rides, 
        startRide, 
        cancelRide, 
        completeRide, 
        currentRide, 
        scheduledRides, 
        addScheduledRide 
    };

    // --- Page Rendering Logic ---
    const renderPage = () => {
        if (!user) {
            switch (page) {
                case 'signup':
                    return <SignUpPage setPage={setPage} />;
                default:
                    return <LoginPage setPage={setPage} />;
            }
        }

        if (user.role === 'Passenger') {
            switch (page) {
                case 'confirm':
                    return <ConfirmRidePage setPage={setPage} rideDetails={currentRide} />;
                case 'tracking':
                    return <TrackingPage setPage={setPage} />;
                case 'profile':
                    return <ProfilePage setPage={setPage} />;
                default:
                    return <PassengerHomePage setPage={setPage} setCurrentRide={setCurrentRide} rides={rides} />;
            }
        }

        if (user.role === 'Fleet Owner') {
            return <FleetOwnerDashboard />;
        }
    };
    
    return (
        <AuthContext.Provider value={authContextValue}>
            <DataContext.Provider value={dataContextValue}>
                <div className="min-h-screen bg-gray-900 text-white font-sans">
                    <Navbar setPage={setPage} />
                    <main className="p-4 md:p-8">
                        {renderPage()}
                    </main>
                </div>
            </DataContext.Provider>
        </AuthContext.Provider>
    );
}