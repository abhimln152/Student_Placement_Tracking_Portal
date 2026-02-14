import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/ui/StatusBadge';
import { toast } from 'react-toastify';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications/all');
            if (response.data.success) {
                setApplications(response.data.applications);
            }
        } catch (error) {
            toast.error("Failed to fetch applications");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/applications/${id}/status`, { status });
            toast.success("Status updated");
            fetchApplications();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">All Applications</h2>

            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company & Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{app.student?.name}</div>
                                    <div className="text-sm text-gray-500">{app.student?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{app.interview?.companyName}</div>
                                    <div className="text-sm text-gray-500">{app.interview?.role}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(app.appliedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <select
                                        className="border rounded text-xs p-1"
                                        value={app.status}
                                        onChange={(e) => updateStatus(app._id, e.target.value)}
                                    >
                                        <option value="applied">Applied</option>
                                        <option value="shortlisted">Shortlisted</option>
                                        <option value="selected">Selected</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminApplications;
