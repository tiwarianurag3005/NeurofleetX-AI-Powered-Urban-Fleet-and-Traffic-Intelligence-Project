import React, { useState, useContext } from 'react';
import  AuthContext  from '../../context/AuthContext';
import DataContext  from '../../context/DataContext';
import RideHistory from './RideHistory';
import StatCard from './StatCard';
import MaintenancePieChart from './MaintenancePieChart';
import MapView from '../common/MapView';
import RideAnalyticsChart from './RideAnalyticsChart';
import VehiclesManagement from './VehiclesManagement';

const FleetOwnerDashboard = () => {
    const { user } = useContext(AuthContext);
    const { vehicles, rides, scheduledRides } = useContext(DataContext);
    const [view, setView] = useState('dashboard');
    const [showHeatmap, setShowHeatmap] = useState(true);

    const ownerVehicles = vehicles.filter(v => v.ownerEmail === user.email);
    const ownerDriverNames = ownerVehicles.map(v => v.driver);
    const ownerRides = rides.filter(r => ownerDriverNames.includes(r.driver));
    
    // Filter scheduled rides to find ones that can be fulfilled by this fleet's vehicles
    const relevantScheduledRides = scheduledRides.filter(sr => 
        ownerVehicles.some(v => v.type === sr.vehicleType && v.capacity >= sr.passengerCount)
    ).map(sr => ({
        ...sr,
        driver: 'Unassigned',
        fare: 'N/A', // Fare is not calculated for scheduled rides yet
        status: 'Pending'
    }));

    const allOwnerRides = [...ownerRides, ...relevantScheduledRides];

    const activeRides = ownerRides.filter(r => r.status === 'In Progress');

    const renderFleetView = () => {
        switch(view) {
            case 'history': return <RideHistory ownerRides={allOwnerRides} />;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Vehicles" value={ownerVehicles.length} />
                            <StatCard title="Active Rides" value={activeRides.length} />
                            <StatCard title="Completed Rides" value={ownerRides.filter(r=>r.status === 'Completed').length} />
                            <MaintenancePieChart vehicles={ownerVehicles} />
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-semibold">Live Vehicle Positions</h3>
                                    <div className="flex items-center space-x-3">
                                        <label className="text-sm text-gray-400">Show Heatmap</label>
                                        <button onClick={() => setShowHeatmap(!showHeatmap)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showHeatmap ? 'bg-cyan-600' : 'bg-gray-600'}`}>
                                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showHeatmap ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>
                                <MapView vehiclePositions={ownerVehicles} showHeatmap={showHeatmap} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">Active Rides</h3>
                                <div className="space-y-4 max-h-[calc(30rem-100px)] overflow-y-auto pr-2">
                                    {activeRides.length > 0 ? activeRides.map(ride => (
                                        <div key={ride.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                            <p className="font-bold">Passenger: {ride.passenger}</p>
                                            <p className="text-sm text-gray-400">From: {ride.pickup} To: {ride.drop}</p>
                                            <p className="text-sm text-cyan-400 mt-1">Fare: ${ride.fare}</p>
                                        </div>
                                    )) : <p className="text-gray-500 p-4 bg-gray-800 rounded-lg text-center">No active rides currently.</p>}
                                </div>
                                <RideAnalyticsChart rides={ownerRides} />
                            </div>
                        </div>
                        <hr className="border-gray-700" />
                        <VehiclesManagement ownerVehicles={ownerVehicles} />
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-center bg-gray-800 rounded-lg p-2 shadow-md max-w-sm mx-auto">
                <button onClick={() => setView('dashboard')} className={`px-6 py-2 w-1/2 rounded-md transition ${view === 'dashboard' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Live Dashboard</button>
                <button onClick={() => setView('history')} className={`px-6 py-2 w-1/2 rounded-md transition ${view === 'history' ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>Ride History</button>
            </div>
            {renderFleetView()}
        </div>
    );
};

export default FleetOwnerDashboard;