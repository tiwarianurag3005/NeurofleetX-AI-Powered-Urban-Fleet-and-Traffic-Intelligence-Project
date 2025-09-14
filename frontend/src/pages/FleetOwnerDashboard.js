import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import VehiclesManagement from '../components/VehiclesManagement';
import RideHistory from '../components/RideHistory';
import StatCard from '../components/StatCard';
import MapView from '../components/MapView';

const FleetOwnerDashboard = () => {
    const { user } = useAuth();
    const { vehicles, rides } = useData();
    const [view, setView] = useState('dashboard');

    // Filter data to show only what belongs to the current fleet owner
    const ownerVehicles = vehicles.filter(v => v.ownerEmail === user.email);
    const ownerDriverNames = ownerVehicles.map(v => v.driver);
    const ownerRides = rides.filter(r => ownerDriverNames.includes(r.driver));
    
    const activeRides = ownerRides.filter(r => r.status === 'In Progress');

    const renderFleetView = () => {
        switch(view) {
            case 'history':
                return <RideHistory ownerRides={ownerRides} />;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard title="Total Vehicles" value={ownerVehicles.length} />
                            <StatCard title="Active Rides" value={activeRides.length} />
                            <StatCard title="Completed Rides" value={ownerRides.filter(r => r.status === 'Completed').length} />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Map View */}
                            <div className="lg:col-span-2">
                                <h3 className="text-2xl font-semibold mb-4">Live Vehicle Positions</h3>
                                <MapView vehiclePositions={ownerVehicles} />
                            </div>
                            {/* Active Rides List */}
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">Active Rides</h3>
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                    {activeRides.length > 0 ? activeRides.map(ride => (
                                        <div key={ride.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                            <p className="font-bold">Passenger: {ride.passenger}</p>
                                            <p className="text-sm text-gray-400">Driver: {ride.driver}</p>
                                            <p className="text-sm text-cyan-400 mt-1">Fare: ${ride.fare}</p>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500">No active rides currently.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-700" />

                        <div>
                            <h2 className="text-3xl font-bold text-center mb-6">Fleet Management</h2>
                            <VehiclesManagement ownerVehicles={ownerVehicles} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-center bg-gray-800 rounded-lg p-2 shadow-md max-w-sm mx-auto">
                <button 
                    onClick={() => setView('dashboard')} 
                    className={`px-6 py-2 w-1/2 rounded-md transition ${
                        view === 'dashboard' 
                            ? 'bg-cyan-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    Live Dashboard
                </button>
                <button 
                    onClick={() => setView('history')} 
                    className={`px-6 py-2 w-1/2 rounded-md transition ${
                        view === 'history' 
                            ? 'bg-cyan-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    Ride History
                </button>
            </div>
            {renderFleetView()}
        </div>
    );
};

export default FleetOwnerDashboard;