import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminDrives = () => {
    const [drives, setDrives] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        company: '', role: '', package: '', date: '', minDsa: 0, minWebd: 0, minReact: 0
    });

    useEffect(() => {
        fetchDrives();
    }, []);

    const fetchDrives = async () => {
        try {
            const response = await api.get('/interviews');
            if (response.data.success) {
                setDrives(response.data.interviews);
            }
        } catch (error) {
            toast.error("Failed to fetch drives");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/interviews/create', formData);
            toast.success("Drive created successfully");
            setShowModal(false);
            fetchDrives();
        } catch (error) {
            toast.error("Failed to create drive");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Placement Drives</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    + Create Drive
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.map((drive) => (
                    <div key={drive._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{drive.companyName}</h3>
                                <p className="text-gray-500 text-sm">{drive.role}</p>
                            </div>
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded">
                                {drive.package}
                            </span>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                            <p>📅 {new Date(drive.date).toLocaleDateString()}</p>
                            <div className="flex space-x-2">
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">DSA: {drive.eligibility?.minDsa}+</span>
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">WebD: {drive.eligibility?.minWebd}+</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Create New Drive</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="w-full p-2 border rounded" placeholder="Company Name" onChange={e => setFormData({ ...formData, company: e.target.value })} />
                            <input className="w-full p-2 border rounded" placeholder="Role" onChange={e => setFormData({ ...formData, role: e.target.value })} />
                            <input className="w-full p-2 border rounded" placeholder="Package (e.g. 10 LPA)" onChange={e => setFormData({ ...formData, package: e.target.value })} />
                            <input type="date" className="w-full p-2 border rounded" onChange={e => setFormData({ ...formData, date: e.target.value })} />
                            <div className="grid grid-cols-3 gap-2">
                                <input type="number" placeholder="Min DSA" className="p-2 border rounded" onChange={e => setFormData({ ...formData, minDsa: e.target.value })} />
                                <input type="number" placeholder="Min WebD" className="p-2 border rounded" onChange={e => setFormData({ ...formData, minWebd: e.target.value })} />
                                <input type="number" placeholder="Min React" className="p-2 border rounded" onChange={e => setFormData({ ...formData, minReact: e.target.value })} />
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDrives;
