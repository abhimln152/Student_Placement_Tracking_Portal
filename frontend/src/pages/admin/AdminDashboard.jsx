import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Building, Briefcase, GraduationCap, ArrowUpRight, Plus, UserPlus, FilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const placementPercentage = stats?.totalStudents > 0 
    ? ((stats.totalPlacedStudents / stats.totalStudents) * 100).toFixed(1) 
    : 0;

  const quickActions = [
    { name: 'Add Student', icon: UserPlus, path: '/admin/students', color: 'bg-blue-50 text-blue-600' },
    { name: 'Add Company', icon: Building, path: '/admin/companies', color: 'bg-indigo-50 text-indigo-600' },
    { name: 'Post New Job', icon: FilePlus, path: '/admin/jobs', color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">University Overview</h1>
          <p className="text-slate-500 mt-1">Monitor placement performance and manage campus recruitment.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           <div className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-xl">
             Session: {new Date().getFullYear()}
           </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Users size={24} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900">{stats?.totalStudents || 0}</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Enrolled</span>
          </div>
        </div>

        {/* Placed Students */}
        <div className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
              <GraduationCap size={24} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-green-500 transition-colors" size={20} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Placed Students</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900">{stats?.totalPlacedStudents || 0}</h3>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Success</span>
          </div>
        </div>

        {/* Active Companies */}
        <div className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <Building size={24} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Companies</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900">{stats?.totalCompanies || 0}</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Partners</span>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-yellow-500/5 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl group-hover:bg-yellow-600 group-hover:text-white transition-colors duration-300">
              <Briefcase size={24} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-yellow-500 transition-colors" size={20} />
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Drives</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-black text-slate-900">{stats?.activeJobs || 0}</h3>
            <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">Live Now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Placement Performance Card */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Placement Performance</h3>
          
          <div className="flex items-center gap-10 mb-8">
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="12"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * placementPercentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900">{placementPercentage}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rate</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
               <div>
                 <div className="flex justify-between text-sm font-bold mb-1.5">
                   <span className="text-slate-500 uppercase tracking-wide">Employment Goal</span>
                   <span className="text-blue-600">Target: 90%</span>
                 </div>
                 <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${placementPercentage}%` }}></div>
                 </div>
               </div>
               <p className="text-sm text-slate-500 leading-relaxed">
                 The current placement rate is based on <strong>{stats?.totalPlacedStudents}</strong> successfully hired students out of <strong>{stats?.totalStudents}</strong> registered candidates.
               </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-8">
             <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Top Recruiter</p>
                <p className="font-bold text-slate-900">Google Inc.</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Avg. Package</p>
                <p className="font-bold text-slate-900">12.5 LPA</p>
             </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {quickActions.map((action) => (
              <Link 
                key={action.name} 
                to={action.path}
                className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${action.color}`}>
                    <action.icon size={20} />
                  </div>
                  <span className="font-bold">{action.name}</span>
                </div>
                <Plus size={20} className="text-white/40 group-hover:text-white transition-colors" />
              </Link>
            ))}
          </div>

          <div className="mt-10 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="font-bold text-lg mb-1">Generate Report</h4>
               <p className="text-white/70 text-xs mb-4">Export the current session analytics as a PDF report.</p>
               <button className="w-full py-2.5 bg-white text-blue-700 font-black text-sm rounded-xl hover:bg-slate-100 transition-colors">
                 Download PDF
               </button>
             </div>
             <div className="absolute -right-4 -bottom-4 bg-white/10 h-24 w-24 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
