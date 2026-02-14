import React from 'react';

const StatusBadge = ({ status }) => {
    const colors = {
        applied: "bg-blue-100 text-blue-800 border-blue-200",
        shortlisted: "bg-yellow-100 text-yellow-800 border-yellow-200",
        selected: "bg-green-100 text-green-800 border-green-200",
        rejected: "bg-red-100 text-red-800 border-red-200",
        placed: "bg-green-100 text-green-800 border-green-200",
        not_placed: "bg-gray-100 text-gray-800 border-gray-200"
    };

    const statusKey = status?.toLowerCase().replace(' ', '_') || 'applied';

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[statusKey] || "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
