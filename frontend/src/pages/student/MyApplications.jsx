import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import { toast } from 'react-toastify';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications/my-applications');
            if (response.data.success) {
                setApplications(response.data.applications);
            }
        } catch (error) {
            toast.error("Failed to fetch applications");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">My Applications & Timeline</h2>

            <div className="space-y-4">
                {applications.map((app) => (
                    <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{app.interview?.companyName}</h3>
                                <p className="text-gray-500">{app.interview?.role}</p>
                                <p className="text-sm text-gray-400 mt-1">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <StatusBadge status={app.status} />
                            </div>
                        </div>

                        {/* Timeline Visualization */}
                        <div className="mt-6 border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between text-sm relative">
                                {/* Line */}
                                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10"></div>

                                <div className={`flex flex-col items-center bg-white px-2 ${['applied', 'shortlisted', 'selected'].includes(app.status) || app.status === 'rejected' ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    <div className={`w-4 h-4 rounded-full mb-1 ${['applied', 'shortlisted', 'selected'].includes(app.status) || app.status === 'rejected' ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                    <span>Applied</span>
                                </div>
                                <div className={`flex flex-col items-center bg-white px-2 ${['shortlisted', 'selected'].includes(app.status) ? 'text-indigo-600' : 'text-gray-400'}`}>
                                    <div className={`w-4 h-4 rounded-full mb-1 ${['shortlisted', 'selected'].includes(app.status) ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                    <span>Shortlisted</span>
                                </div>
                                <div className={`flex flex-col items-center bg-white px-2 ${app.status === 'selected' ? 'text-green-600' : (app.status === 'rejected' ? 'text-red-600' : 'text-gray-400')}`}>
                                    <div className={`w-4 h-4 rounded-full mb-1 ${app.status === 'selected' ? 'bg-green-600' : (app.status === 'rejected' ? 'bg-red-600' : 'bg-gray-300')}`}></div>
                                    <span>{app.status === 'rejected' ? 'Rejected' : 'Selected'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {applications.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        You haven't applied to any drives yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
