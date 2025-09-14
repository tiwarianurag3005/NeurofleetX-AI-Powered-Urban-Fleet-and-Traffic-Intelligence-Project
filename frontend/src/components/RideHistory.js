import React from 'react';

const RideHistory = ({ ownerRides }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-400';
            case 'Cancelled': return 'text-red-400';
            case 'In Progress': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Ride History</h3>
            <div className="bg-gray-800 rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Passenger</th>
                            <th className="p-4 font-semibold">Driver</th>
                            <th className="p-4 font-semibold">Fare</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ownerRides.length > 0 ? ownerRides.slice().reverse().map(ride => (
                            <tr key={ride.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-4">{ride.date}</td>
                                <td className="p-4">{ride.passenger}</td>
                                <td className="p-4">{ride.driver}</td>
                                <td className="p-4 text-cyan-400">${ride.fare}</td>
                                <td className={`p-4 font-semibold ${getStatusColor(ride.status)}`}>
                                    {ride.status}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center p-8 text-gray-500">
                                    No ride history available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RideHistory;