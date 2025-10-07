import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { CarIcon, UserCircleIcon } from './Icons';

const Navbar = ({ setPage }) => {
    const { user, logout } = useContext(AuthContext);

    const handleNavigation = (page) => {
        setPage(page);
    };

    return (
        <nav className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center space-x-3">
                <CarIcon className="w-8 h-8 text-cyan-400" />
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
                    Neurofleet<span className="text-cyan-400">X</span>
                </h1>
            </div>
            {user && (
                <div className="flex items-center space-x-4">
                    <span className="hidden md:block text-gray-300">Welcome, {user.name}</span>
                    
                    {/* Navigation buttons */}
                    <button 
                        onClick={() => handleNavigation('dashboard')} 
                        className="text-gray-300 hover:text-white transition"
                    >
                        Dashboard
                    </button>
                    
                    {user.role === 'Passenger' && (
                        <button 
                            onClick={() => handleNavigation('profile')} 
                            className="p-2 rounded-full hover:bg-gray-700 transition"
                        >
                            <UserCircleIcon className="w-6 h-6 text-gray-300" />
                        </button>
                    )}
                    
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;