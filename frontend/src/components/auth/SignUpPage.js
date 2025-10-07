import React, { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const SignUpPage = ({ setPage }) => {
    const { signup } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Passenger');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        
        setError('');
        setLoading(true);
        
        const result = await signup({ name, email, password, role });
        
        if (!result.success) {
            setError(result.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white">Create an Account</h2>
                <form className="space-y-6" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                        <input 
                            id="name" 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                            placeholder="e.g., John Doe" 
                            required 
                            autoComplete="off"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="email-signup" className="text-sm font-medium text-gray-400">Email</label>
                        <input 
                            id="email-signup" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                            placeholder="you@example.com" 
                            required 
                            autoComplete="off"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password-signup" className="text-sm font-medium text-gray-400">Password</label>
                        <input 
                            id="password-signup" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                            placeholder="••••••••" 
                            required 
                            autoComplete="new-password"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="text-sm font-medium text-gray-400">I am a...</label>
                        <select 
                            id="role" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            disabled={loading}
                        >
                            <option value="Passenger">Passenger</option>
                            <option value="Fleet Owner">Fleet Owner</option>
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <button 
                        onClick={() => setPage('login')} 
                        className="font-medium text-cyan-400 hover:text-cyan-300"
                        disabled={loading}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;