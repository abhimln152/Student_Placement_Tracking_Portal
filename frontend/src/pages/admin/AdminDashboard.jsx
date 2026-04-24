import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Building, Briefcase, GraduationCap } from 'lucide-react';

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

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  const placementPercentage = stats?.totalStudents > 0 
    ? ((stats.totalPlacedStudents / stats.totalStudents) * 100).toFixed(1) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white rounded-lg shadow p-6 border-l-4 border-primary">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Analytics Overview</h2>
          <p className="text-gray-600 mt-1">Real-time placement drive statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-3xl font-semibold text-gray-900">{stats?.totalStudents || 0}</p>
            </div>
            <div className="p-3 text-blue-600 bg-blue-100 rounded-lg">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Placed Students</p>
              <p className="text-3xl font-semibold text-gray-900">{stats?.totalPlacedStudents || 0}</p>
            </div>
            <div className="p-3 text-green-600 bg-green-100 rounded-lg">
              <GraduationCap size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Placement Rate</p>
              <p className="text-3xl font-semibold text-gray-900">{placementPercentage}%</p>
            </div>
            <div className="p-3 text-purple-600 bg-purple-100 rounded-lg">
              <span className="text-xl font-bold">%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Jobs</p>
              <p className="text-3xl font-semibold text-gray-900">{stats?.activeJobs || 0}</p>
            </div>
            <div className="p-3 text-yellow-600 bg-yellow-100 rounded-lg">
              <Briefcase size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
         <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Platform Summary</h3>
         <p className="text-gray-600">
           The system is currently tracking {stats?.totalStudents} students and {stats?.totalCompanies} companies. 
           There are {stats?.activeJobs} active job listings. To manage details, use the navigation menu on the left.
         </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
