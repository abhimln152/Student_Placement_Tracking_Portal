import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from '../../components/ui/StatCard';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        placementPercentage: 0,
        activeDrives: 0,
        placementStats: [],
        monthlyApplications: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/admin');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 rounded-xl bg-gray-200 animate-pulse"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-80 rounded-xl bg-gray-200 animate-pulse"></div>
                    <div className="h-48 rounded-xl bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Students" value={stats.totalStudents} />
                <StatCard title="Placement %" value={`${stats.placementPercentage}%`} />
                <StatCard title="Active Drives" value={stats.activeDrives} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Applications</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.monthlyApplications}>
                                <XAxis dataKey="_id.month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link to="/admin/drives" className="block w-full text-center bg-indigo-50 text-indigo-700 py-3 rounded-lg font-medium hover:bg-indigo-100 transition">
                            Manage Drives
                        </Link>
                        <Link to="/admin/applications" className="block w-full text-center bg-green-50 text-green-700 py-3 rounded-lg font-medium hover:bg-green-100 transition">
                            View Recent Applications
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
