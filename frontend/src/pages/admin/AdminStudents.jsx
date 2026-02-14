import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [formData, setFormData] = useState({
        name: '', batch: '', dsa: 0, webd: 0, react: 0, isPlaced: false
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/users/students');
            if (response.data.success) {
                setStudents(response.data.students);
            }
        } catch (error) {
            toast.error("Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (student) => {
        setSelectedStudent(student);
        setFormData({
            name: student.name,
            batch: student.batch || '',
            dsa: student.scores?.dsa || 0,
            webd: student.scores?.webd || 0,
            react: student.scores?.react || 0,
            isPlaced: student.isPlaced
        });
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/users/students/${selectedStudent._id}`, formData);
            if (response.data.success) {
                toast.success("Student updated successfully");
                setIsEditing(false);
                fetchStudents();
            }
        } catch (error) {
            toast.error("Failed to update student");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
            </div>

            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scores (D/W/R)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            // Skeleton Rows
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div></td>
                                    <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-8 animate-pulse ml-auto"></div></td>
                                </tr>
                            ))
                        ) : (
                            students.map((student) => (
                                <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-xs text-gray-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.batch || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${student.isPlaced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {student.isPlaced ? 'Placed' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                        {student.scores?.dsa || 0} / {student.scores?.webd || 0} / {student.scores?.react || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(student)}
                                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Student</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Batch</label>
                                <input
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={formData.batch}
                                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase">DSA</label>
                                    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.dsa} onChange={e => setFormData({ ...formData, dsa: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase">WebD</label>
                                    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.webd} onChange={e => setFormData({ ...formData, webd: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase">React</label>
                                    <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.react} onChange={e => setFormData({ ...formData, react: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="isPlaced"
                                    checked={formData.isPlaced}
                                    onChange={(e) => setFormData({ ...formData, isPlaced: e.target.checked })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isPlaced" className="text-sm text-gray-700">Mark as Placed</label>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
