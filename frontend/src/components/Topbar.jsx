import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell } from 'lucide-react';

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm h-20 z-10 sticky top-0">
      <div className="flex items-center justify-between px-8 h-full">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {user?.role === 'ADMIN' ? 'Admin Gateway' : 'Student Portal'}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors hidden sm:block">
            <Bell className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              <p className="text-xs font-medium text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
