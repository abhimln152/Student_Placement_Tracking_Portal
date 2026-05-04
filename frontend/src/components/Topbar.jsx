import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Menu, Search } from 'lucide-react';

const Topbar = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-20 z-30 sticky top-0">
      <div className="flex items-center justify-between px-4 sm:px-8 h-full">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="p-2 mr-4 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="hidden sm:block">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.role === 'ADMIN' ? 'Admin Overview' : 'Student Portal'}
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-6">
          <div className="hidden lg:flex items-center bg-gray-100 rounded-xl px-3 py-2 w-64 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all">
              <Bell size={22} />
            </button>
            
            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block" />

            <div className="flex items-center group cursor-pointer">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">{user?.email?.split('@')[0]}</p>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
