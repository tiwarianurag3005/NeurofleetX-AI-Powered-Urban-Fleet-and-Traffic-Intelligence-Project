// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const token = localStorage.getItem("authToken");
//   const navigate = useNavigate();

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     navigate("/");
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
//         <div className="text-2xl font-bold text-indigo-600">NeuroFleetX</div>
//         <div className="flex items-center gap-4">
//           <Link to="/" className="text-sm hover:underline">Home</Link>
//           {token ? (
//             <>
//               <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
//               <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="text-sm hover:underline">Login</Link>
//               <Link to="/register" className="text-sm bg-green-600 text-white px-3 py-1 rounded">Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CarIcon, UserCircleIcon } from './Icons';

const Navbar = ({ setPage }) => {
    const { user, logout } = useAuth();

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
                    {user.role === 'Passenger' && (
                        <button 
                            onClick={() => setPage('profile')} 
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
