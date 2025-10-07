import React, { useState } from 'react';

const RideAnalyticsChart = ({ rides }) => {
    const [chartType, setChartType] = useState('rides'); // 'rides' or 'fare'

    const processData = () => {
        const dataByDate = rides.reduce((acc, ride) => {
            if (ride.status !== 'Completed') return acc;
            const date = ride.date;
            acc[date] = acc[date] || { rides: 0, fare: 0 };
            acc[date].rides += 1;
            acc[date].fare += ride.fare;
            return acc;
        }, {});

        const sortedDates = Object.keys(dataByDate).sort((a,b) => new Date(a) - new Date(b));
        
        const labels = sortedDates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const data = sortedDates.map(date => dataByDate[date][chartType]);
        
        return { labels, data };
    };

    const { labels, data } = processData();
    const maxValue = data.length > 0 ? Math.max(...data, 1) : 1; // Avoid division by zero and error on empty array

    return (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg">Ride Analytics</h4>
                <div className="bg-gray-700 p-1 rounded-lg text-xs">
                    <button onClick={() => setChartType('rides')} className={`px-2 py-1 rounded ${chartType === 'rides' ? 'bg-cyan-600' : ''}`}>Rides</button>
                    <button onClick={() => setChartType('fare')} className={`px-2 py-1 rounded ${chartType === 'fare' ? 'bg-cyan-600' : ''}`}>Fare</button>
                </div>
            </div>
            {rides.filter(r => r.status === 'Completed').length > 0 ? (
                <div>
                    <div className="flex h-40 space-x-2 items-end border-b border-gray-700 pb-2">
                        {data.map((value, index) => (
                            <div key={index} className="flex-1 group relative flex justify-center">
                                <div 
                                    className="w-3/4 bg-cyan-600 hover:bg-cyan-500 rounded-t-md transition-all duration-300" 
                                    style={{ height: `${(value / maxValue) * 100}%` }}
                                >
                                    <span className="absolute -top-5 left-0 right-0 text-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        {chartType === 'fare' ? `$${value}` : value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex h-6 space-x-2 items-start pt-1">
                        {labels.map((label, index) => (
                            <div key={index} className="flex-1 text-center">
                                <span className="text-xs text-gray-400">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-10">No completed ride data to display.</p>
            )}
        </div>
    );
};

export default RideAnalyticsChart;