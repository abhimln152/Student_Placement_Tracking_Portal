import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
    const { user, fetchProfile } = useAuth(); // Get fetchProfile from context

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        👤 My Profile
                    </h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Batch</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{user.batch}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">College ID</label>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{user.college}</p>
                    </div>

                    <div className="col-span-2 border-t pt-6 mt-2">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            📊 Placement Scores
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
                                <p className="text-sm text-blue-600 font-medium">DSA</p>
                                <p className="text-2xl font-bold text-blue-900">{user.scores?.dsa || 0}</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg text-center border border-purple-100">
                                <p className="text-sm text-purple-600 font-medium">Web Dev</p>
                                <p className="text-2xl font-bold text-purple-900">{user.scores?.webd || 0}</p>
                            </div>
                            <div className="p-4 bg-pink-50 rounded-lg text-center border border-pink-100">
                                <p className="text-sm text-pink-600 font-medium">React</p>
                                <p className="text-2xl font-bold text-pink-900">{user.scores?.react || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 border-t pt-6 mt-2">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            📄 Resume
                        </h3>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <div className="flex-1">
                                {user.resumePath ? (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Resume Uploaded</p>
                                            <a
                                                href={`http://localhost:8000${user.resumePath}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline"
                                            >
                                                View Current File
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-200 rounded-lg text-gray-500">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                        </div>
                                        <p className="text-gray-500 text-sm">No resume uploaded yet.</p>
                                    </div>
                                )}
                            </div>

                            <div className="w-full sm:w-auto">
                                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg shadow-sm transition flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    {user.resumePath ? 'Update Resume' : 'Upload Resume'}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append('resume', file);

                                            try {
                                                const token = localStorage.getItem('token');
                                                const response = await fetch('http://localhost:8000/api/v1/users/upload-resume', {
                                                    method: 'POST',
                                                    headers: { 'Authorization': token },
                                                    body: formData
                                                });
                                                const data = await response.json();
                                                if (data.success) {
                                                    // Sync profile immediately
                                                    await fetchProfile();
                                                    alert('Resume uploaded successfully!');
                                                } else {
                                                    alert(data.message || 'Upload failed');
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                alert('Upload failed');
                                            }
                                        }}
                                    />
                                </label>
                                <p className="text-xs text-center text-gray-400 mt-1">PDF/DOCX max 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
