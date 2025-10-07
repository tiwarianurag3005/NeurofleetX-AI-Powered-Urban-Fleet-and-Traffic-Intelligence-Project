import React, { useState, useContext } from 'react';
import  DataContext  from '../../context/DataContext';
import { MapPinIcon } from '../common/Icons';

const VehiclesManagement = ({ ownerVehicles }) => {
    const { addVehicle, removeVehicle } = useContext(DataContext);
    const [vehicleName, setVehicleName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [location, setLocation] = useState('');
    const [maintenanceSlider, setMaintenanceSlider] = useState(0); // 0: Healthy, 1: Due, 2: Critical
    const [vehicleType, setVehicleType] = useState('Normal');
    const [passengerCapacity, setPassengerCapacity] = useState('');


    const statusMap = {
        0: { name: 'Healthy', description: 'Vehicle is in optimal condition. No issues reported.', color: 'text-green-400' },
        1: { name: 'Due', description: 'Routine maintenance (e.g., oil change) is due soon.', color: 'text-yellow-400' },
        2: { name: 'Critical', description: 'Urgent service is required. Vehicle may be unsafe.', color: 'text-red-400' }
    };

    const handleAddVehicle = (e) => {
        e.preventDefault();
        if (vehicleName && driverName && location && passengerCapacity) {
            const maintenanceStatusName = statusMap[maintenanceSlider].name;
            addVehicle({ 
                name: vehicleName, 
                driver: driverName, 
                location: location, 
                maintenanceStatus: maintenanceStatusName,
                type: vehicleType,
                capacity: passengerCapacity
            });
            setVehicleName(''); 
            setDriverName(''); 
            setLocation(''); 
            setMaintenanceSlider(0);
            setVehicleType('Normal');
            setPassengerCapacity('');
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-center mb-6">Fleet Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <h3 className="text-2xl font-semibold mb-4">Add New Vehicle</h3>
                    <form onSubmit={handleAddVehicle} className="bg-gray-800 p-6 rounded-2xl space-y-4 shadow-lg">
                        <input type="text" value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} placeholder="Vehicle Model (e.g., Toyota Prius)" className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                        <input type="text" value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Driver Name" className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                        <div className="relative">
                            <MapPinIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Current Location (e.g., Downtown)" className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Vehicle Type</label>
                            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                <option>Normal</option>
                                <option>Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Passenger Capacity</label>
                            <input type="number" value={passengerCapacity} onChange={(e) => setPassengerCapacity(e.target.value)} placeholder="e.g., 4" className="mt-1 w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required min="1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Maintenance Status</label>
                            <input type="range" min="0" max="2" step="1" value={maintenanceSlider} onChange={(e) => setMaintenanceSlider(parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer mt-2" />
                            <div className={`mt-2 text-center font-bold ${statusMap[maintenanceSlider].color}`}>{statusMap[maintenanceSlider].name}</div>
                            <p className="text-xs text-gray-500 text-center mt-1 h-8">{statusMap[maintenanceSlider].description}</p>
                        </div>
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
                                        <div className="flex items-center space-x-3">
                                            <p className="font-bold">{v.name}</p>
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v.type === 'Emergency' ? 'bg-red-600 text-white' : 'bg-blue-500 text-white'}`}>{v.type}</span>
                                        </div>
                                        <p className="text-sm text-gray-400">Driver: {v.driver} | Capacity: {v.capacity} passengers</p>
                                        <p className="text-xs text-gray-500">Location: {v.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-semibold ${v.status === 'Idle' ? 'text-yellow-400' : 'text-green-400'}`}>{v.status}</p>
                                        <button onClick={() => removeVehicle(v.id)} className="text-red-400 hover:text-red-500 text-sm font-semibold">Remove</button>
                                    </div>
                                </div>
                            )) : ( <p className="text-gray-500 p-4 text-center">No vehicles added to your fleet yet.</p> )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehiclesManagement;