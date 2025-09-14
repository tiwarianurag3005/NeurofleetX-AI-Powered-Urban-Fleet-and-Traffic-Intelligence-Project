import React from 'react';

const StatCard = ({ title, value }) => (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-4xl font-bold text-cyan-400">{value}</p>
    </div>
);

export default StatCard;