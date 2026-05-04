import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  FileText, 
  CircleHelp,
  LogOut, 
  Users,
  Building,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: UserCircle },
    { name: 'Job Openings', path: '/student/jobs', icon: Briefcase },
    { name: 'My Applications', path: '/student/applications', icon: FileText },
    { name: 'Support', path: '/student/support', icon: CircleHelp },
  ];

  const adminLinks = [
    { name: 'Analytics Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Manage Companies', path: '/admin/companies', icon: Building },
    { name: 'Job Postings', path: '/admin/jobs', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-slate-800
      `}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Placement Portal
          </h1>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`
                }
              >
                <Icon className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110`} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
          >
            <LogOut className="mr-3 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
