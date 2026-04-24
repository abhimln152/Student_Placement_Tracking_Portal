import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, FileText } from 'lucide-react';

const AdminApplications = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch jobs to select for reviewing applications
        api.get('/jobs/all').then(res => setJobs(res.data)).catch(console.error);
    }, []);

    const fetchApplications = async (jobId) => {
        setLoading(true);
        setSelectedJob(jobId);
        try {
            const response = await api.get(`/applications/job/${jobId}`);
            setApplications(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (appId, newStatus) => {
        try {
            await api.patch(`/applications/${appId}/status?status=${newStatus}`);
            // Refresh purely this job's list locally to avoid extra calls
            setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg shadow-sm">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Review Applications</h3>
                <p className="mt-1 text-sm text-gray-500">Select a drive to manage candidate statuses.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1 bg-white shadow rounded-lg p-4 max-h-[70vh] overflow-y-auto">
                    <h4 className="font-semibold text-gray-700 mb-4 border-b pb-2">Placement Drives</h4>
                    <div className="space-y-2">
                        {jobs.map(job => (
                            <button
                                key={job.id}
                                onClick={() => fetchApplications(job.id)}
                                className={`w-full text-left p-3 rounded-md text-sm transition-colors ${selectedJob === job.id ? 'bg-primary text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-800'}`}
                            >
                                <div className="font-medium truncate">{job.company.name}</div>
                                <div className={`text-xs truncate ${selectedJob === job.id ? 'text-blue-100' : 'text-gray-500'}`}>{job.title}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-3 bg-white shadow rounded-lg overflow-hidden">
                    {!selectedJob ? (
                        <div className="flex items-center justify-center p-20 text-gray-500">
                            Select a drive from the left to view applicants.
                        </div>
                    ) : loading ? (
                        <div className="p-10 text-center">Loading applications...</div>
                    ) : applications.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No applications found for this drive.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CGPA / Branch</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map((app) => (
                                        <tr key={app.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{app.student.fullName}</div>
                                                <div className="text-sm text-gray-500">{app.student.rollNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{app.student.cgpa} out of 10</div>
                                                <div className="text-sm text-gray-500">{app.student.branch}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                                <a href={app.student.resumeUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">View</a>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <select 
                                                    value={app.status} 
                                                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                    className={`rounded-md p-1 border text-sm font-semibold
                                                        ${app.status === 'HIRED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        app.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        app.status === 'SHORTLISTED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'}`}
                                                >
                                                    <option value="PENDING">PENDING</option>
                                                    <option value="SHORTLISTED">SHORTLISTED</option>
                                                    <option value="REJECTED">REJECTED</option>
                                                    <option value="HIRED">HIRED</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminApplications;
