import React, { useEffect, useState } from 'react';
import StatCard from '../../components/ui/StatCard';
import api from '../../services/api';
import { Briefcase, List, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecommendedJobsList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get('/jobs/all');
                if (response.data.success) {
                    setJobs(response.data.jobs);
                }
            } catch (error) {
                console.error("Failed to fetch jobs");
            }
        };
        fetchJobs();
    }, []);

    if (jobs.length === 0) {
        return <p className="text-gray-400 text-sm italic">No recommended jobs at the moment.</p>;
    }

    return (
        <div className="space-y-3">
            {jobs.map(job => (
                <div key={job._id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                    <div>
                        <h4 className="font-semibold text-gray-800">{job.companyName}</h4>
                        <p className="text-sm text-indigo-600">{job.role}</p>
                    </div>
                    <a
                        href={job.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-100 transition flex items-center gap-1"
                    >
                        Apply <ExternalLink size={12} />
                    </a>
                </div>
            ))}
        </div>
    );
};

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        isPlaced: false,
        totalApplied: 0,
        totalShortlisted: 0,
        totalSelected: 0,
        eligibleDrivesCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/student');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse"></div>
                    ))}
                </div>
                <div className="h-40 rounded-xl bg-white border border-gray-100 p-6">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-24 rounded-xl bg-gray-200 animate-pulse"></div>
                    <div className="h-24 rounded-xl bg-gray-200 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-indigo-100 text-sm font-medium uppercase tracking-wider">My Status</h3>
                    <p className="text-3xl font-bold mt-2">
                        {stats.isPlaced ? 'Placed 🎉' : 'Active'}
                    </p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wider">Eligible Drives</h3>
                    <p className="text-3xl font-bold mt-2">{stats.eligibleDrivesCount}</p>
                </div>
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-pink-100 text-sm font-medium uppercase tracking-wider">Applications</h3>
                    <p className="text-3xl font-bold mt-2">{stats.totalApplied}</p>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="p-1 bg-indigo-100 rounded text-indigo-600"><List size={18} /></span>
                    Recent Activity
                </h3>
                {stats.totalApplied > 0 ? (
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>You have applied to <strong>{stats.totalApplied}</strong> companies. Check "My Applications" for details.</span>
                        </li>
                    </ul>
                ) : (
                    <p className="text-gray-400 text-sm italic">No recent activity.</p>
                )}
            </div>

            {/* Recommended Jobs Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="p-1 bg-indigo-100 rounded text-indigo-600"><Briefcase size={18} /></span>
                    Recommended Opportunities
                </h3>

                {loading ? (
                    <div className="space-y-3">
                        <div className="h-16 bg-gray-50 rounded animate-pulse"></div>
                        <div className="h-16 bg-gray-50 rounded animate-pulse"></div>
                    </div>
                ) : (
                    <RecommendedJobsList />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/student/drives" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">View Eligible Drives</h3>
                        <p className="text-sm text-gray-500">Check and apply for new opportunities</p>
                    </div>
                </Link>

                <Link to="/student/applications" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-center space-x-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <List size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Track Applications</h3>
                        <p className="text-sm text-gray-500">See status updates for your applications</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default StudentDashboard;
