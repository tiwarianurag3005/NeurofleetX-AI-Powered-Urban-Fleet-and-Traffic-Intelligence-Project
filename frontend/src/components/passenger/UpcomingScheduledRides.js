import React, { useContext } from 'react';
import DataContext  from '../../context/DataContext';

const UpcomingScheduledRides = () => {
    const { scheduledRides } = useContext(DataContext);

    if (scheduledRides.length === 0) {
        return null;
    }

    return (
        <div className="p-6 bg-gray-800 rounded-2xl shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-center">Your Scheduled Rides</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto">
                {scheduledRides.map(ride => (
                    <div key={ride.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-sm">From: {ride.pickup}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ride.vehicleType === 'Emergency' ? 'bg-red-600 text-white' : 'bg-blue-500 text-white'}`}>{ride.vehicleType}</span>
                        </div>
                        <p className="font-bold text-sm">To: {ride.drop}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(ride.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {ride.time}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingScheduledRides;