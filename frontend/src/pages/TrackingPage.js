import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { UserCircleIcon } from '../components/Icons';
import MapView from '../components/MapView';

const TrackingPage = ({ setPage }) => {
    const { currentRide, cancelRide, completeRide } = useData();
    
    useEffect(() => {
        // Simulate the ride automatically completing after 20 seconds for demo purposes
        const timer = setTimeout(() => {
            if (currentRide && currentRide.status === 'In Progress') {
                completeRide(currentRide);
                setPage('passenger');
            }
        }, 20000);

        return () => clearTimeout(timer);
    }, [currentRide, completeRide, setPage]);

    if (!currentRide) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold">No active ride to track.</h2>
                <button 
                    onClick={() => setPage('passenger')} 
                    className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Tracking Your Ride</h2>
            <MapView />
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex items-center space-x-4">
                    <UserCircleIcon className="w-16 h-16 text-gray-500" />
                    <div>
                        <p className="text-gray-400">Your Driver</p>
                        <p className="text-xl font-bold">{currentRide.driver}</p>
                        <p className="text-sm text-cyan-400">Tesla Model S - White</p>
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <p className="text-gray-400">Status</p>
                    <p className="text-xl font-bold text-green-400 animate-pulse">{currentRide.status}</p>
                </div>
                <button 
                    onClick={cancelRide}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 w-full md:w-auto"
                >
                    Cancel Ride
                </button>
            </div>
        </div>
    );
};

export default TrackingPage;