import React, { useContext } from 'react';
import DataContext  from '../../context/DataContext';

const ConfirmRidePage = ({ setPage, rideDetails }) => {
    const { startRide, vehicles } = useContext(DataContext);
    // Check for a specific vehicle match now
    const isVehicleAvailable = vehicles.some(v => 
        v.status === 'Idle' &&
        v.type === rideDetails.route.vehicleType &&
        v.capacity >= rideDetails.route.passengerCount
    );
    
    return (
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ride Confirmation</h2>
            <p className="text-gray-400 mb-8">Please review your ride details and preferences below.</p>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6 text-left">
                <div className="flex justify-between items-center"> <span className="text-gray-400">Pickup:</span> <span className="font-semibold text-lg">{rideDetails.pickup}</span> </div>
                <div className="flex justify-between items-center"> <span className="text-gray-400">Drop:</span> <span className="font-semibold text-lg">{rideDetails.drop}</span> </div>
                <div className="border-t border-gray-700 my-4"></div>
                <div className="flex justify-between items-center"> <span className="text-gray-400">Vehicle Type:</span> <span className="font-semibold text-lg">{rideDetails.route.vehicleType}</span> </div>
                <div className="flex justify-between items-center"> <span className="text-gray-400">Passengers:</span> <span className="font-semibold text-lg">{rideDetails.route.passengerCount}</span> </div>
                <div className="border-t border-gray-700 my-4"></div>
                <div className="flex justify-between items-center"> <span className="text-gray-400">Estimated Fare:</span> <span className="font-bold text-2xl text-cyan-400">${rideDetails.fare}</span> </div>
                <div className="flex justify-between items-center"> <span className="text-gray-400">Predicted Arrival (ETA):</span> <span className="font-bold text-2xl text-green-400">{rideDetails.eta} mins</span> </div>
                <div className="text-center text-sm text-gray-500 pt-4"> <p>Route: {rideDetails.route.name} ({rideDetails.route.status})</p> </div>
                {!isVehicleAvailable && (<div className="text-center text-lg text-yellow-400 pt-4"><p>Searching for a driver... No matching vehicles are available right now. Please go back and try different options.</p></div>)}
            </div>
            <div className="mt-8 flex space-x-4 justify-center">
                <button onClick={() => startRide(rideDetails)} disabled={!isVehicleAvailable} className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition duration-300">Confirm & Book</button>
                <button onClick={() => setPage('passenger')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">Back</button>
            </div>
        </div>
    );
};

export default ConfirmRidePage;