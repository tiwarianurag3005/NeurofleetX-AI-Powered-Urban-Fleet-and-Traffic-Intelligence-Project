import React, { useRef, useEffect } from 'react';
import { CarIcon, MapPinIcon } from './Icons';

const MapView = ({ children, vehiclePositions, routes, selectedRouteId, pickupCoords, dropCoords, showHeatmap }) => {
    const mapRef = useRef(null);
    const carRef = useRef(null);

    useEffect(() => {
        if (carRef.current && !vehiclePositions) { // only animate on tracking page
            const animateCar = () => {
                if(!mapRef.current) return;
                const mapWidth = mapRef.current.offsetWidth;
                const mapHeight = mapRef.current.offsetHeight;
                const newX = Math.random() * (mapWidth - 40);
                const newY = Math.random() * (mapHeight - 40);

                carRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
            };
            const interval = setInterval(animateCar, 3000);
            return () => clearInterval(interval);
        }
    }, [vehiclePositions]);

    const getRouteStyle = (status) => {
        switch (status) {
            case 'All Clear': return { stroke: '#2dd4bf', strokeWidth: 6, filter: 'drop-shadow(0 0 5px #2dd4bf)' };
            case 'Busy': return { stroke: '#facc15', strokeWidth: 6, filter: 'drop-shadow(0 0 5px #facc15)' };
            case 'Much Busy': return { stroke: '#f87171', strokeWidth: 6, filter: 'drop-shadow(0 0 5px #f87171)' };
            default: return { stroke: '#6b7280', strokeWidth: 6 };
        }
    };
    
    const renderMapTiles = () => {
        const tiles = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                tiles.push(
                    <img key={`${i}-${j}`} src={`https://a.basemaps.cartocdn.com/dark_all/12/${1025+i}/${1585+j}.png`} className="absolute" style={{ top: `${i*256}px`, left: `${j*256}px`, width: '256px', height: '256px', opacity: 0.6 }} alt="map tile" onError={(e) => { e.target.style.display = 'none'; }} />
                );
            }
        }
        return <div className="absolute inset-0 overflow-hidden">{tiles}</div>;
    };


    return (
        <div ref={mapRef} className="relative w-full h-96 md:h-[600px] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            {renderMapTiles()}
             {showHeatmap && (
                <div className="absolute inset-0 z-0 pointer-events-none" style={{
                    background: `
                        radial-gradient(circle at 25% 30%, rgba(255, 0, 0, 0.4), transparent 30%),
                        radial-gradient(circle at 60% 70%, rgba(255, 165, 0, 0.5), transparent 25%),
                        radial-gradient(circle at 75% 25%, rgba(255, 80, 0, 0.4), transparent 20%)
                    `,
                    mixBlendMode: 'color-dodge'
                }}></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>

            <div className="absolute bottom-4 right-4 bg-gray-900/50 p-1 rounded-lg space-y-1 z-10">
                <button className="w-8 h-8 text-white text-xl font-bold bg-gray-700/80 rounded-md hover:bg-gray-600">+</button>
                <button className="w-8 h-8 text-white text-xl font-bold bg-gray-700/80 rounded-md hover:bg-gray-600">-</button>
            </div>
            
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                {routes && routes.map(route => (
                    <g key={route.id} style={{ opacity: selectedRouteId === route.id || !selectedRouteId ? 1 : 0.35, transition: 'opacity 0.3s' }}>
                        <path d={route.path} fill="none" stroke="#111827" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
                        <path d={route.path} fill="none" style={{ ...getRouteStyle(route.status) }} strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                ))}
            </svg>
            
            {routes && routes.map(route => (
                 <div key={`info-${route.id}`} className="absolute" style={{ ...route.infoPosition, pointerEvents: 'auto', opacity: selectedRouteId === route.id || !selectedRouteId ? 1 : 0.35, transition: 'opacity 0.3s' }}>
                     <div className={`flex items-center space-x-2 p-2 rounded-lg shadow-xl ${selectedRouteId === route.id ? 'bg-cyan-600' : 'bg-gray-900/80 backdrop-blur-sm'}`}>
                         <CarIcon className="w-5 h-5" />
                         <div><p className="font-bold text-sm">{route.time}</p><p className="text-xs text-gray-300">{route.distance}</p></div>
                     </div>
                 </div>
            ))}

            {children}
            
            {!vehiclePositions && carRef && (
                 <div ref={carRef} className="absolute top-1/2 left-1/2 transition-transform duration-3000 ease-in-out z-20">
                     <CarIcon className="w-10 h-10 text-cyan-400 transform -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                 </div>
            )}
            
            {pickupCoords && (<div className="absolute z-10" style={{ top: pickupCoords.y, left: pickupCoords.x, transform: 'translate(-50%, -100%)' }}><MapPinIcon className="w-10 h-10 text-green-400 drop-shadow-lg" /><span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm">P</span></div>)}
            {dropCoords && (<div className="absolute z-10" style={{ top: dropCoords.y, left: dropCoords.x, transform: 'translate(-50%, -100%)' }}><MapPinIcon className="w-10 h-10 text-red-400 drop-shadow-lg" /><span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm">D</span></div>)}
            
            {vehiclePositions && vehiclePositions.map(v => (
                 <div key={v.id} style={{ top: `${20 + (v.id % 5) * 15}%`, left: `${10 + (v.id % 7) * 12}%` }} className="absolute transition-all duration-1000 z-20">
                     <div className="relative group">
                         <CarIcon className={`w-8 h-8 ${v.status === 'On Ride' ? 'text-green-400' : 'text-yellow-400'} drop-shadow-lg`} />
                         <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity"> {v.driver} ({v.name}) <br/> Status: {v.status} </div>
                     </div>
                 </div>
            ))}
        </div>
    );
};

export default MapView;