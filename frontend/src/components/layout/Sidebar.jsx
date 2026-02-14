import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Briefcase, FileText, PieChart, User, List } from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth();
    const role = user?.role;

    const adminLinks = [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Manage Students", path: "/admin/students", icon: <Users size={20} /> },
        { name: "External Jobs", path: "/admin/jobs", icon: <Briefcase size={20} /> },
        { name: "Drives", path: "/admin/drives", icon: <Briefcase size={20} /> },
        { name: "Applications", path: "/admin/applications", icon: <FileText size={20} /> },
        // { name: "Reports", path: "/admin/reports", icon: <PieChart size={20} /> } // Phase 4
    ];

    const studentLinks = [
        { name: "Dashboard", path: "/student", icon: <LayoutDashboard size={20} /> },
        { name: "Eligible Drives", path: "/student/drives", icon: <Briefcase size={20} /> },
        { name: "My Applications", path: "/student/applications", icon: <List size={20} /> },
        { name: "Profile", path: "/student/profile", icon: <User size={20} /> }
    ];

    const links = role === "admin" ? adminLinks : studentLinks;

    return (
        <div className="w-64 bg-indigo-900 text-white min-h-screen flex flex-col shadow-xl z-20">
            <div className="p-6 border-b border-indigo-800">
                <h1 className="text-2xl font-bold tracking-tight">Placement<span className="text-indigo-400">Portal</span></h1>
                <p className="text-xs text-indigo-300 mt-1 uppercase tracking-wider">{role} Panel</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map(link => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/admin' || link.path === '/student'}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out ${isActive
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg translate-x-1"
                                : "text-indigo-200 hover:bg-white/10 hover:text-white"
                            }`
                        }
                    >
                        {link.icon}
                        <span className="font-medium">{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-indigo-800">
                <div className="flex items-center space-x-3 text-indigo-200">
                    <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                    <div className="truncate">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs truncate">{user?.email}</p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Sidebar;
