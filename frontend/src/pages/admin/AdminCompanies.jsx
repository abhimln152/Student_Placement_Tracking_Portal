import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building, Globe, Plus } from 'lucide-react';

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCompany, setNewCompany] = useState({
        name: '',
        description: '',
        website: '',
        industry: ''
    });

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/companies', newCompany);
            setShowModal(false);
            setNewCompany({ name: '', description: '', website: '', industry: '' });
            fetchCompanies();
        } catch (error) {
            alert('Failed to add company. Name may already exist.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Partner Companies</h3>
                    <p className="mt-1 text-sm text-gray-500">Manage companies visiting the campus for placement drives.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Company
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full text-center py-10">Loading companies...</div>
                ) : companies.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm text-gray-500">
                        No companies added yet. Click 'Add Company' to get started.
                    </div>
                ) : (
                    companies.map(company => (
                        <div key={company.id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col">
                            <div className="px-4 py-5 sm:p-6 flex-1">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Building className="mr-2 h-5 w-5 text-gray-400" />
                                    {company.name}
                                </h3>
                                <p className="text-sm font-medium text-primary mt-1">{company.industry}</p>
                                <div className="mt-4 text-sm text-gray-600 line-clamp-3">
                                    {company.description}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center text-sm">
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                                    <Globe className="mr-1 h-4 w-4" /> Wait...
                                </a>
                                <span className="text-gray-500">Joined: {new Date(company.createdAt).getFullYear()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4">Add Visiting Company</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Industry</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newCompany.industry} onChange={e => setNewCompany({ ...newCompany, industry: e.target.value })} placeholder="e.g. IT, Finance, Manufacturing" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Website URL</label>
                                <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newCompany.website} onChange={e => setNewCompany({ ...newCompany, website: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Profile/Description</label>
                                <textarea required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" value={newCompany.description} onChange={e => setNewCompany({ ...newCompany, description: e.target.value })}></textarea>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md text-gray-700">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Save Company</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCompanies;
