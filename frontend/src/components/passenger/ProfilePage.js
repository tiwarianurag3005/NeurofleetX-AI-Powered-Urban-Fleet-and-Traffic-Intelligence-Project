import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const ProfilePage = ({ setPage }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Your Profile</h2>
            <div className="bg-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
                <div className="flex flex-col"> <span className="text-gray-400 text-sm">Name</span> <span className="font-semibold text-lg">{user.name}</span> </div>
                <div className="flex flex-col"> <span className="text-gray-400 text-sm">Email</span> <span className="font-semibold text-lg">{user.email}</span> </div>
                <div className="flex flex-col"> <span className="text-gray-400 text-sm">Account Type</span> <span className="font-semibold text-lg">{user.role}</span> </div>
            </div>
            <div className="mt-8 flex justify-center">
                <button onClick={() => setPage('passenger')} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300">Back to Home</button>
            </div>
        </div>
    );
};

export default ProfilePage;