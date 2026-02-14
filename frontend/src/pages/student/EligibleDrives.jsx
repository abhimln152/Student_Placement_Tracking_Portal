import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const EligibleDrives = () => {
    const [drives, setDrives] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDrives = async () => {
            try {
                const response = await api.get('/interviews');
                if (response.data.success) {
                    const allDrives = response.data.interviews;
                    // Map drives to include eligibility status
                    const processedDrives = allDrives.map(drive => {
                        const isEligible =
                            user.scores.dsa >= drive.eligibility.minDsa &&
                            user.scores.webd >= drive.eligibility.minWebd &&
                            user.scores.react >= drive.eligibility.minReact;

                        // Calculate missing skills for feedback
                        const missing = [];
                        if (user.scores.dsa < drive.eligibility.minDsa) missing.push(`DSA: ${user.scores.dsa}/${drive.eligibility.minDsa}`);
                        if (user.scores.webd < drive.eligibility.minWebd) missing.push(`WebD: ${user.scores.webd}/${drive.eligibility.minWebd}`);
                        if (user.scores.react < drive.eligibility.minReact) missing.push(`React: ${user.scores.react}/${drive.eligibility.minReact}`);

                        return { ...drive, isEligible, missing };
                    });
                    setDrives(processedDrives);
                }
            } catch (error) {
                toast.error("Failed to fetch drives");
            }
        };
        fetchDrives();
    }, [user.scores]);

    const handleApply = async (interviewId) => {
        try {
            await api.post(`/applications/apply/${interviewId}`);
            toast.success("Applied successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Drives</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drives.length > 0 ? drives.map((drive) => (
                    <div key={drive._id} className={`p-6 rounded-xl shadow-sm border transition flex flex-col justify-between ${drive.isEligible ? 'bg-white border-gray-100 hover:shadow-md' : 'bg-gray-50 border-gray-200 opacity-90'}`}>
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg text-gray-900">{drive.companyName}</h3>
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${drive.isEligible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {drive.package}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">{drive.role}</p>
                            <p className="text-sm text-gray-400 mt-2">📅 {new Date(drive.date).toLocaleDateString()}</p>

                            {!drive.isEligible && (
                                <div className="mt-3 text-xs text-red-500 bg-red-50 p-2 rounded">
                                    <p className="font-semibold">Not Eligible:</p>
                                    <ul className="list-disc list-inside">
                                        {drive.missing.map((reason, idx) => (
                                            <li key={idx}>{reason}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => handleApply(drive._id)}
                            disabled={!drive.isEligible}
                            className={`mt-6 w-full py-2 rounded-lg transition font-medium ${drive.isEligible
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {drive.isEligible ? 'Apply Now' : 'Not Eligible'}
                        </button>
                    </div>
                )) : (
                    <p className="text-gray-500 col-span-3 text-center py-10">No drives found.</p>
                )}
            </div>
        </div>
    );
};

export default EligibleDrives;
