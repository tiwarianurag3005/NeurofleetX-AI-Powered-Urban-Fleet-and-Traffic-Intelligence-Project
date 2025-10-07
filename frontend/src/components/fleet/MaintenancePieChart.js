import React from 'react';

const MaintenancePieChart = ({ vehicles }) => {
    const data = vehicles.reduce((acc, v) => { acc[v.maintenanceStatus] = (acc[v.maintenanceStatus] || 0) + 1; return acc; }, { Healthy: 0, Due: 0, Critical: 0 });
    const total = vehicles.length;
    if (total === 0) { return (<div className="bg-gray-800 p-6 rounded-2xl shadow-lg"><p className="text-gray-400 text-sm font-medium">Maintenance Status</p><p className="text-gray-500 mt-4 text-center">No vehicle data</p></div>); }
    const percentages = { Healthy: (data.Healthy / total) * 100, Due: (data.Due / total) * 100, Critical: (data.Critical / total) * 100, };
    const colors = { Healthy: '#2dd4bf', Due: '#facc15', Critical: '#f87171' };
    let cumulativePercent = 0;
    const segments = Object.keys(percentages).map(key => {
        const percent = percentages[key];
        if (percent === 0) return null;
        const startAngle = (cumulativePercent / 100) * 360;
        cumulativePercent += percent;
        const endAngle = (cumulativePercent / 100) * 360;
        const start = { x: 50 + 40 * Math.cos(Math.PI * (startAngle - 90) / 180), y: 50 + 40 * Math.sin(Math.PI * (startAngle - 90) / 180), };
        const end = { x: 50 + 40 * Math.cos(Math.PI * (endAngle - 90) / 180), y: 50 + 40 * Math.sin(Math.PI * (endAngle - 90) / 180), };
        const largeArcFlag = percent > 50 ? 1 : 0;
        return `M 50,50 L ${start.x},${start.y} A 40,40 0 ${largeArcFlag},1 ${end.x},${end.y} Z`;
    }).filter(Boolean);

    return (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
            <p className="text-gray-400 text-sm font-medium mb-2">Maintenance Status</p>
            <div className="flex items-center space-x-4">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                    {segments.map((path, i) => (<path key={i} d={path} fill={colors[Object.keys(percentages).filter(k => percentages[k] > 0)[i]]} />))}
                </svg>
                <div className="text-sm space-y-1">
                    {Object.keys(colors).map(key => ( <div key={key} className="flex items-center space-x-2"> <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[key] }}></div> <span>{key} ({data[key]})</span> </div> ))}
                </div>
            </div>
        </div>
    );
};

export default MaintenancePieChart;