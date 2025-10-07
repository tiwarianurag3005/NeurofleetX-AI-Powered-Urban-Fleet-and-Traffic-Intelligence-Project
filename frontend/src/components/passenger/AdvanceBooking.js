import React, { useState, useContext } from 'react';
import  AuthContext  from '../../context/AuthContext';
import DataContext  from '../../context/DataContext';
import { MapPinIcon } from '../common/Icons';

const AdvanceBooking = () => {
    const { addScheduledRide } = useContext(DataContext);
    const { user } = useContext(AuthContext);
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [vehicleType, setVehicleType] = useState('Normal');
    const [passengerCount, setPassengerCount] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');

    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleScheduleRide = (e) => {
        e.preventDefault();
        if (!pickup || !drop || !date || !time) return;

        addScheduledRide({
            pickup,
            drop,
            date,
            time,
            vehicleType,
            passengerCount,
            passenger: user.name,
        });

        setSuccessMessage(`Your ride from ${pickup} to ${drop} has been scheduled for ${date} at ${time}.`);
        setPickup('');
        setDrop('');
        setDate('');
        setTime('');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div className="p-6 bg-gray-800 rounded-2xl shadow-lg space-y-4 mt-6">
            <h2 className="text-3xl font-bold text-center">Advance Booking</h2>
            <form onSubmit={handleScheduleRide} className="space-y-4">
                <div className="relative">
                    <MapPinIcon className="w-5 h-5 text-green-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Enter Pickup Location" className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required/>
                </div>
                <div className="relative">
                    <MapPinIcon className="w-5 h-5 text-red-400 absolute top-1/2 left-3 -translate-y-1/2" />
                    <input type="text" value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Enter Drop Location" className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required min={getTodayString()} />
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400">Vehicle Type</label>
                        <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Normal</option>
                            <option>Emergency</option>
                        </select>
                    </div>
                    <div>
                       <label className="text-sm font-medium text-gray-400">Passengers</label>
                       <input type="number" value={passengerCount} onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)} placeholder="1" className="mt-1 w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" required min="1" />
                    </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300">Schedule Ride</button>
            </form>
            {successMessage && <p className="text-center text-green-400 mt-3 text-sm">{successMessage}</p>}
        </div>
    );
};

export default AdvanceBooking;