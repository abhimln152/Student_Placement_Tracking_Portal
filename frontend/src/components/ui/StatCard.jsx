import React from 'react';

const StatCard = ({ title, value }) => (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition border border-gray-100">
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
);

export default StatCard;
