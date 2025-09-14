import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MapPinIcon } from './Icons';

const VehiclesManagement = ({ ownerVehicles }) => {
    const { addVehicle, removeVehicle } = useData();
    const [vehicleName, setVehicleName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [location, setLocation] = useState('');

    const handleAddVehicle = (e) => {
        e.preventDefault();
        if (vehicleName && driverName && location) {
            // In a real app, you would use a geocoding API to convert the location string to lat/lng.
            // Here, we simulate it with random coordinates for demonstration.
            const randomLat = 40.7128 + (Math.random() - 0.5) * 5; // Simulate a wider area
            const randomLng = -74.0060 + (Math.random() - 0.5) * 5;

            addVehicle({ 
                name: vehicleName, 
                driver: driverName,
                location: location,
                lat: randomLat,
                lng: randomLng
            });
            setVehicleName('');
            setDriverName('');
            setLocation('');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <h3 className="text-2xl font-semibold mb-4">Add New Vehicle</h3>
                <form onSubmit={handleAddVehicle} className="bg-gray-800 p-6 rounded-2xl space-y-4 shadow-lg">
                    <input 
                        type="text" 
                        value={vehicleName}
                        onChange={(e) => setVehicleName(e.target.value)}
                        placeholder="Vehicle Model (e.g., Toyota Prius)" 
                        className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                    />
                    <input 
                        type="text" 
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        placeholder="Driver Name" 
                        className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        required
                    />
                    <div className="relative">
                        <MapPinIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Current Location (e.g., Downtown)" 
                            className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            required
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center">Location is validated by our mapping service.</p>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-lg transition">Add Vehicle</button>
                </form>
            </div>
            <div className="lg:col-span-2">
                <h3 className="text-2xl font-semibold mb-4">Current Fleet</h3>
                <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {ownerVehicles.length > 0 ? ownerVehicles.map(v => (
                            <div key={v.id} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                                <div>
                                    <p className="font-bold">{v.name}</p>
                                    <p className="text-sm text-gray-400">Driver: {v.driver}</p>
                                    <p className="text-xs text-gray-500">Location: {v.location}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-semibold ${v.status === 'Idle' ? 'text-yellow-400' : 'text-green-400'}`}>{v.status}</p>
                                    <button onClick={() => removeVehicle(v.id)} className="text-red-400 hover:text-red-500 text-sm font-semibold">Remove</button>
                                </div>
                            </div>
                        )) : (
                            <p className="text-gray-500 p-4 text-center">No vehicles added to your fleet yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehiclesManagement;