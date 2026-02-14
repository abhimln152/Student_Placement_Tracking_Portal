import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white font-bold text-xl">
                            Placement Portal
                        </Link>
                        {user && (
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <Link to="/students" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Students</Link>
                                <Link to="/interviews" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Interviews</Link>
                                <Link to="/jobs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">External Jobs</Link>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-white text-sm">Hello, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="text-white hover:text-gray-200">Login</Link>
                                <Link to="/signup" className="text-indigo-200 hover:text-white">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
