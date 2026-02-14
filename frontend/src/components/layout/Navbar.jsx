import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-800">
                Welcome back, {user?.name.split(' ')[0]}
            </h2>

            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="h-6 w-px bg-gray-200"></div>

                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-1 rounded-md hover:bg-red-50"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
