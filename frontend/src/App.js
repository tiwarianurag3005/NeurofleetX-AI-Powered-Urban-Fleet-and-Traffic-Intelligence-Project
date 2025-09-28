import React, { useState, useEffect } from 'react';

// --- Contexts ---
import AuthContext from './context/AuthContext';
import DataContext from './context/DataContext';

// --- Common Components ---
import Navbar from './components/common/Navbar';

// --- Page Components ---
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
    const [currentRide, setCurrentRide] = useState(null);

    // --- Effects to load data from localStorage on initial render ---
    useEffect(() => {
        // By commenting out the following lines, the app will start fresh every time
        // and will not load any previously saved data from localStorage.

        // const loggedInUser = JSON.parse(localStorage.getItem('neurofleetx_user'));
        // if (loggedInUser) {
        //     setUser(loggedInUser);
        //     setPage(loggedInUser.role === 'Passenger' ? 'passenger' : 'fleet');
        // }

        // const storedUsers = JSON.parse(localStorage.getItem('neurofleetx_users_db'));
        // if (storedUsers) {
        //     setUsers(storedUsers);
        // }

        // const storedVehicles = JSON.parse(localStorage.getItem('neurofleetx_vehicles'));
        // if (storedVehicles) {
        //     setVehicles(storedVehicles);
        // }

        // const storedRides = JSON.parse(localStorage.getItem('neurofleetx_rides'));
        // if (storedRides) {
        //     setRides(storedRides);
        // }
    }, []);

    // --- Authentication Functions ---
    const login = (credentials) => {
        const userExists = users.find(u => u.email === credentials.email && u.password === credentials.password);
        if (userExists) {
            localStorage.setItem('neurofleetx_user', JSON.stringify(userExists));
            setUser(userExists);
            setPage(userExists.role === 'Passenger' ? 'passenger' : 'fleet');
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password.' };
    };

    const signup = (userData) => {
        const emailExists = users.some(u => u.email === userData.email);
        if (emailExists) {
            return { success: false, message: 'An account with this email already exists.' };
        }
        
        const newUsers = [...users, userData];
        setUsers(newUsers);
        localStorage.setItem('neurofleetx_users_db', JSON.stringify(newUsers));

        localStorage.setItem('neurofleetx_user', JSON.stringify(userData));
        setUser(userData);
        setPage(userData.role === 'Passenger' ? 'passenger' : 'fleet');
        return { success: true };
    };

    const logout = () => {
        localStorage.removeItem('neurofleetx_user');
        setUser(null);
        setPage('login');
    };

    // --- Data Management Functions ---
    const addVehicle = (vehicleData) => {
        const newVehicles = [...vehicles, { ...vehicleData, id: Date.now(), status: 'Idle', ownerEmail: user.email }];
        localStorage.setItem('neurofleetx_vehicles', JSON.stringify(newVehicles));
        setVehicles(newVehicles);
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
    const authContextValue = { user, login, signup, logout };
    const dataContextValue = { vehicles, addVehicle, removeVehicle, rides, startRide, cancelRide, completeRide, currentRide };

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