import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Trash2, ExternalLink, Plus } from 'lucide-react';

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '', role: '', jobUrl: '', description: ''
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await api.get('/jobs/all');
            if (response.data.success) {
                setJobs(response.data.jobs);
            }
        } catch (error) {
            toast.error("Failed to fetch jobs");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs/create', formData);
            toast.success("Job link added successfully");
            setShowModal(false);
            setFormData({ companyName: '', role: '', jobUrl: '', description: '' });
            fetchJobs();
        } catch (error) {
            toast.error("Failed to add job link");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this link?")) {
            try {
                await api.delete(`/jobs/${id}`);
                toast.success("Link deleted");
                fetchJobs();
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">External Job Links</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Link
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition relative group">
                        <button
                            onClick={() => handleDelete(job._id)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 size={18} />
                        </button>

                        <h3 className="font-bold text-lg text-gray-900">{job.companyName}</h3>
                        <p className="text-indigo-600 font-medium mb-2">{job.role}</p>

                        {job.description && (
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{job.description}</p>
                        )}

                        <a
                            href={job.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                            Apply Now <ExternalLink size={14} />
                        </a>
                    </div>
                ))}

                {jobs.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No job links added yet.
                    </div>
                )}
            </div>

            {/* Add Job Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">Add Recommended Job</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.companyName}
                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <input
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
                                <input
                                    type="url"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.jobUrl}
                                    onChange={e => setFormData({ ...formData, jobUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">Add Link</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminJobs;
