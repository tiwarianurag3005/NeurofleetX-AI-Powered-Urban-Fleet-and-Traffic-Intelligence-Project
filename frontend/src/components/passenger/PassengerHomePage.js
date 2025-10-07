import React, { useState, useEffect, useContext } from 'react';
import DataContext from '../../context/DataContext';
import MapView from '../common/MapView';
import UpcomingScheduledRides from './UpcomingScheduledRides';
import AdvanceBooking from './AdvanceBooking';
import { MapPinIcon, SparklesIcon, ArrowRightIcon } from '../common/Icons';

const PassengerHomePage = ({ setPage, setCurrentRide, rides }) => {
    const { vehicles } = useContext(DataContext);
    const [pickup, setPickup] = useState('');
    const [drop, setDrop] = useState('');
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [bookingMessage, setBookingMessage] = useState('');
    const [pickupCoords, setPickupCoords] = useState(null);
    const [dropCoords, setDropCoords] = useState(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [suggestedDestinations, setSuggestedDestinations] = useState([]);

    const [vehicleType, setVehicleType] = useState('Normal');
    const [passengerCount, setPassengerCount] = useState(1);
    const [aiRouteSuggestion, setAiRouteSuggestion] = useState('');
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [aiError, setAiError] = useState('');

    const availableVehicles = vehicles.filter(v => v.status === 'Idle');

    const isMatchingVehicleAvailable = availableVehicles.some(
        v => v.type === vehicleType && v.capacity >= passengerCount
    );

    // Suggested destinations
    useEffect(() => {
        const destinationCounts = rides.reduce((acc, ride) => {
            if (ride.drop) acc[ride.drop] = (acc[ride.drop] || 0) + 1;
            return acc;
        }, {});
        const sortedDestinations = Object.entries(destinationCounts)
            .sort((a, b) => b[1] - a[1])
            .map(item => item[0])
            .slice(0, 3);
        setSuggestedDestinations(sortedDestinations);
    }, [rides]);

    // Route generation
    const handleFindRoutes = () => {
        if (pickup && drop) {
            const trafficFactors = { 'All Clear': 1.0, 'Busy': 1.5, 'Much Busy': 2.0 };
            const generatedRoutes = [
                { id: 1, name: 'Main St Route', status: 'All Clear', path: 'M 100 450 C 150 300, 250 250, 350 280 S 500 350, 600 300 S 750 200, 800 150', infoPosition: { top: '42%', left: '45%' } },
                { id: 2, name: 'Highway Route', status: 'Busy', path: 'M 100 450 C 180 480, 280 400, 400 380 S 550 420, 650 350 S 780 250, 800 150', infoPosition: { top: '65%', left: '50%' } },
                { id: 3, name: 'City Bypass', status: 'Much Busy', path: 'M 100 450 Q 200 550, 400 500 T 650 400 Q 750 350, 800 150', infoPosition: { top: '78%', left: '30%' } }
            ].map(route => {
                const distance = (2.0 + Math.random() * 0.5).toFixed(1);
                const mlEta = Math.round((distance * 5) * trafficFactors[route.status] + Math.random() * 2);
                return {
                    ...route,
                    distance: `${distance} km`,
                    time: `${mlEta} min`,
                    vehicleType,
                    passengerCount,
                };
            });

            setRoutes(generatedRoutes);
            setBookingMessage(
                isMatchingVehicleAvailable
                    ? 'Please select a route to book.'
                    : 'No vehicles match your criteria. See available vehicles below.'
            );
            setPickupCoords({ x: '100px', y: '450px' });
            setDropCoords({ x: '800px', y: '150px' });
            setSelectedRoute(null);
        } else {
            setRoutes([]);
            setSelectedRoute(null);
            setPickupCoords(null);
            setDropCoords(null);
        }
    };

    useEffect(() => {
        handleFindRoutes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pickup, drop, vehicles, vehicleType, passengerCount]);

    // ✅ Gemini AI Route Optimization (React + fetch, working with gemini-2.5-flash)
    const handleAiRouteOptimization = async () => {
        if (!pickup || !drop) return;

        setIsOptimizing(true);
        setAiError('');
        setAiRouteSuggestion('');

        const systemPrompt =
            "You are a witty but helpful AI traffic navigator for a user in India. Your goal is to suggest an optimized route between a pickup and drop location. Consider typical traffic, time of day, and potential shortcuts. Provide a short, actionable, and slightly humorous suggestion. Format your response as a single paragraph.";

        const userQuery = `Suggest an optimized route from "${pickup}" to "${drop}".`;

        const apiKey = "AIzaSyDQC_fbX4zMZuQW7LAwl3jWHfjl4Og_eYU";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [
                { role: "user", parts: [{ text: `${systemPrompt}\n\n${userQuery}` }] }
            ]
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                console.error("Gemini API Error Body:", errorBody);
                throw new Error(
                    `API Error ${response.status}: ${errorBody.error?.message || "Unknown error"}`
                );
            }

            const result = await response.json();
            const aiText =
                result?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "No suggestion generated. Try again!";

            setAiRouteSuggestion(aiText);
        } catch (err) {
            console.error("Gemini API Error:", err);
            setAiError(err.message);
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleBookRide = () => {
        if (pickup && drop && selectedRoute && isMatchingVehicleAvailable) {
            const rideDetails = {
                pickup,
                drop,
                fare: Math.floor(parseFloat(selectedRoute.distance) * 5 + 5),
                eta: parseInt(selectedRoute.time),
                route: selectedRoute
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

    const handleSuggestionClick = (destination) => {
        setDrop(destination);
        if (!pickup) setPickup("City Center");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <UpcomingScheduledRides />
                <h2 className="text-3xl font-bold">Book a Ride</h2>

                {/* Booking Form */}
                <div className="p-6 bg-gray-800 rounded-2xl shadow-lg space-y-4">
                    {suggestedDestinations.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-bold text-gray-400">Smart Recommendations</h4>
                            <div className="flex flex-wrap gap-2">
                                {suggestedDestinations.map(dest => (
                                    <button
                                        key={dest}
                                        onClick={() => handleSuggestionClick(dest)}
                                        className="bg-gray-700 hover:bg-cyan-800 text-xs text-cyan-300 font-semibold py-1 px-3 rounded-full transition"
                                    >
                                        {dest}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
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

                    {/* Vehicle type and passengers */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-400">Vehicle Type</label>
                            <select
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <option>Normal</option>
                                <option>Emergency</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-400">Passengers</label>
                            <input
                                type="number"
                                value={passengerCount}
                                onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
                                placeholder="1"
                                className="mt-1 w-full bg-gray-700 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    {/* Heatmap toggle */}
                    <div className="flex items-center justify-between pt-2">
                        <label className="text-sm text-gray-400">Show Traffic Heatmap</label>
                        <button
                            onClick={() => setShowHeatmap(!showHeatmap)}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${showHeatmap ? 'bg-cyan-600' : 'bg-gray-600'}`}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showHeatmap ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                </div>

                {/* AI Section */}
                <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-center">AI Route Optimization</h3>
                    <div className="flex justify-center">
                        <button
                            onClick={handleAiRouteOptimization}
                            disabled={!pickup || !drop || isOptimizing}
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center space-x-2"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            <span>{isOptimizing ? 'Optimizing...' : 'Get AI Suggestion'}</span>
                        </button>
                    </div>
                    {aiError && <p className="text-red-400 text-center mt-3 text-sm">{aiError}</p>}
                    {aiRouteSuggestion && (
                        <div className="mt-4 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                            <p className="text-gray-300 leading-relaxed text-sm italic">{aiRouteSuggestion}</p>
                        </div>
                    )}
                </div>

                {/* Route selection & booking */}
                {routes.length > 0 && isMatchingVehicleAvailable && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Select Route</h3>
                        <div className="space-y-3">
                            {routes.map(route => (
                                <button
                                    key={route.id}
                                    onClick={() => setSelectedRoute(route)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition ${selectedRoute?.id === route.id
                                        ? 'bg-cyan-900/50 border-cyan-400'
                                        : 'bg-gray-800 hover:bg-gray-700 ' + getStatusColorClass(route.status)}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold">{route.name}</span>
                                        <span
                                            className={`font-semibold text-sm ${getStatusColorClass(route.status).replace('border-', 'text-')}`}
                                        >
                                            {route.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-1">ETA: {route.time} ({route.distance})</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="pt-4">
                    <button
                        onClick={handleBookRide}
                        disabled={!pickup || !drop || !selectedRoute || !isMatchingVehicleAvailable}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
                    >
                        <span>Book Ride</span>
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    {bookingMessage && <p className="text-center text-sm text-gray-400 mt-3">{bookingMessage}</p>}
                </div>

                {routes.length > 0 && !isMatchingVehicleAvailable && (
                    <div className="space-y-3 pt-4">
                        <h3 className="text-xl font-semibold mb-2 text-yellow-400 text-center">No Vehicles Match Your Request</h3>
                        <p className="text-sm text-gray-400 text-center mb-4">Below is a list of vehicles that are currently available.</p>
                        {availableVehicles.map(v => (
                            <div key={v.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold">{v.name}</p>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${v.type === 'Emergency' ? 'bg-red-600 text-white' : 'bg-blue-500 text-white'}`}>{v.type}</span>
                                </div>
                                <p className="text-sm text-gray-400">Driver: {v.driver}</p>
                                <p className="text-sm text-gray-400">Capacity: {v.capacity} passengers</p>
                            </div>
                        ))}
                    </div>
                )}
                <AdvanceBooking />
            </div>

            {/* Map Section */}
            <div className="lg:col-span-2">
                <MapView
                    vehiclePositions={availableVehicles}
                    routes={routes}
                    selectedRouteId={selectedRoute?.id}
                    pickupCoords={pickupCoords}
                    dropCoords={dropCoords}
                    showHeatmap={showHeatmap}
                />
            </div>
        </div>
    );
};

export default PassengerHomePage;
