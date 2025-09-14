import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { MapPinIcon, ArrowRightIcon } from '../components/Icons';
import MapView from '../components/MapView';

const PassengerHomePage = ({ setPage, setCurrentRide }) => {
    const { vehicles } = useData();
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [bookingMessage, setBookingMessage] = useState('');
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);

    const availableVehicles = vehicles.filter(v => v.status === 'Idle');
    const isVehicleNearby = availableVehicles.length > 0;

    const handleFindRoutes = () => {
        if (pickup && drop) {
            // Simulate generating 3 different routes with different traffic and more realistic paths
            const generatedRoutes = [
                { 
                    id: 1, 
                    name: 'Main St Route', 
                    status: 'All Clear', 
                    time: '9 min', 
                    distance: '2.6 km', 
                    path: 'M 100 450 C 150 300, 250 250, 350 280 S 500 350, 600 300 S 750 200, 800 150', 
                    infoPosition: { top: '42%', left: '45%' } 
                },
                { 
                    id: 2, 
                    name: 'Highway Route', 
                    status: 'Busy', 
                    time: '11 min', 
                    distance: '2.8 km', 
                    path: 'M 100 450 C 180 480, 280 400, 400 380 S 550 420, 650 350 S 780 250, 800 150', 
                    infoPosition: { top: '65%', left: '50%' } 
                },
                { 
                    id: 3, 
                    name: 'City Bypass', 
                    status: 'Much Busy', 
                    time: '14 min', 
                    distance: '3.1 km', 
                    path: 'M 100 450 Q 200 550, 400 500 T 650 400 Q 750 350, 800 150', 
                    infoPosition: { top: '78%', left: '30%' } 
                }
            ];
            setRoutes(generatedRoutes);
            setBookingMessage(
                isVehicleNearby 
                    ? 'Please select a route to book.' 
                    : 'No vehicles are available in your area right now.'
            );
            // Simulate placing pickup and drop pins on the map
            setPickupCoords({ x: '100px', y: '450px' });
            setDropCoords({ x: '800px', y: '150px' });
        } else {
            setRoutes([]);
            setSelectedRoute(null);
            setPickupCoords(null);
            setDropCoords(null);
        }
    };
    
    useEffect(() => {
        handleFindRoutes();
    }, [pickup, drop, vehicles]);

    const handleBookRide = () => {
        if (pickup && drop && selectedRoute && isVehicleNearby) {
            const distance = Math.floor(Math.random() * 20) + 5;
            const rideDetails = {
                pickup,
                drop,
                fare: distance * 10,
                eta: Math.floor(Math.random() * 11) + 5,
                route: selectedRoute,
            };
            setCurrentRide(rideDetails);
            setPage('confirm');
        }
    };

    const getStatusColorClass = (status) => {
        if (status === 'All Clear') return 'border-teal-400';
        if (status === 'Busy') return 'border-yellow-400';
        if (status === 'Much Busy') return 'border-red-400';
        return 'border-gray-600';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <h2 className="text-3xl font-bold">Where to?</h2>
                <div className="p-6 bg-gray-800 rounded-2xl shadow-lg space-y-4">
                    <div className="relative">
                        <MapPinIcon className="w-5 h-5 text-green-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <input 
                            type="text"
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            placeholder="Enter Pickup Location" 
                            className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        />
                    </div>
                    <div className="relative">
                        <MapPinIcon className="w-5 h-5 text-red-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <input 
                            type="text" 
                            value={drop}
                            onChange={(e) => setDrop(e.target.value)}
                            placeholder="Enter Drop Location" 
                            className="w-full bg-gray-700 border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        />
                    </div>
                </div>
                {routes.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Available Routes</h3>
                        <div className="space-y-3">
                            {routes.map(route => (
                                <button 
                                    key={route.id} 
                                    onClick={() => setSelectedRoute(route)} 
                                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                                        selectedRoute?.id === route.id 
                                            ? 'bg-cyan-900/50 border-cyan-400' 
                                            : 'bg-gray-800 hover:bg-gray-700 ' + getStatusColorClass(route.status)
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">{route.name}</span>
                                        <span className={`font-semibold text-sm ${
                                            getStatusColorClass(route.status).replace('border-','text-')
                                        }`}>
                                            {route.status}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="pt-4">
                    <button
                        onClick={handleBookRide}
                        disabled={!pickup || !drop || !selectedRoute || !isVehicleNearby}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
                    >
                        <span>Book Ride</span>
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    {bookingMessage && (
                        <p className="text-center text-sm text-gray-400 mt-3">{bookingMessage}</p>
                    )}
                </div>
            </div>
            <div className="lg:col-span-2">
                <MapView 
                    vehiclePositions={availableVehicles} 
                    routes={routes} 
                    selectedRouteId={selectedRoute?.id}
                    pickupCoords={pickupCoords}
                    dropCoords={dropCoords}
                />
            </div>
        </div>
    );
};

export default PassengerHomePage;