import React from 'react';

const RideHistory = ({ ownerRides }) => {
    const downloadCSV = () => {
        const headers = "Date,Passenger,Driver,Fare,Status\n";
        const csvContent = ownerRides.map(r => `${r.date},${r.passenger},${r.driver},${r.fare},${r.status}`).join("\n");
        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "ride_history.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const exportPDF = () => { window.print(); };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-400';
            case 'Cancelled': return 'text-red-400';
            case 'Pending': return 'text-yellow-400';
            case 'In Progress': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="mt-8">
            <style>
                {`@media print { body * { visibility: hidden; } #print-section, #print-section * { visibility: visible; } #print-section { position: absolute; left: 0; top: 0; width: 100%; } nav, button, .no-print { display: none !important; } }`}
            </style>
            <div className="flex justify-between items-center mb-4 no-print">
                <h3 className="text-2xl font-semibold">Ride History</h3>
                <div className="space-x-3">
                    <button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">Download CSV</button>
                    <button onClick={exportPDF} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">Export PDF</button>
                </div>
            </div>
            <div id="print-section" className="bg-gray-800 rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th className="p-4 font-semibold">Date</th><th className="p-4 font-semibold">Passenger</th><th className="p-4 font-semibold">Driver</th><th className="p-4 font-semibold">Fare</th><th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ownerRides.length > 0 ? ownerRides
                            .slice()
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map(ride => (
                            <tr key={ride.id} className="border-b border-gray-700 last:border-b-0">
                                <td className="p-4">{ride.date}{ride.time ? ` at ${ride.time}`: ''}</td>
                                <td className="p-4">{ride.passenger}</td>
                                <td className="p-4">{ride.driver}</td>
                                <td className="p-4 text-cyan-400">{ride.fare === 'N/A' ? 'N/A' : `$${ride.fare}`}</td>
                                <td className={`p-4 font-semibold ${getStatusColor(ride.status)}`}>{ride.status}</td>
                            </tr>
                        )) : ( <tr><td colSpan="5" className="text-center p-8 text-gray-500">No ride history available.</td></tr> )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RideHistory;