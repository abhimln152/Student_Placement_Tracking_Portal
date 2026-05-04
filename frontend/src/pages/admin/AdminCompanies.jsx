import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building, Globe, Plus, Search, ExternalLink, Briefcase, Users, Trash2 } from 'lucide-react';

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredCompanies = companies.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-emerald-500'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Partner Companies</h1>
                    <p className="text-slate-500 mt-1">Manage and track organizations visiting for recruitment.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <Plus className="mr-2 h-5 w-5" /> Add New Company
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mr-4">
                        <Building size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Partners</p>
                        <p className="text-2xl font-bold text-slate-900">{companies.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl mr-4">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Sectors</p>
                        <p className="text-2xl font-bold text-slate-900">{new Set(companies.map(c => c.industry)).size}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Onboarded In</p>
                        <p className="text-2xl font-bold text-slate-900">{new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search companies by name or industry..." 
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
                    ))
                ) : filteredCompanies.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <Building className="h-16 w-16 text-slate-200 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900">No companies found</h3>
                        <p className="text-slate-500">Try adjusting your search or add a new partner.</p>
                    </div>
                ) : (
                    filteredCompanies.map((company, idx) => (
                        <div 
                            key={company.id} 
                            className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`h-12 w-12 rounded-xl ${colors[idx % colors.length]} flex items-center justify-center text-white font-bold shadow-inner`}>
                                        {getInitials(company.name)}
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-tight group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        {company.industry || 'General'}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {company.name}
                                </h3>
                                
                                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                                    {company.description}
                                </p>
                            </div>

                            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl flex justify-between items-center">
                                {company.website ? (
                                    <a 
                                        href={company.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1.5"
                                    >
                                        <Globe size={16} />
                                        Visit Website
                                        <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <span className="text-slate-400 text-sm italic">No website provided</span>
                                )}
                                <span className="text-xs font-medium text-slate-400">
                                    {new Date(company.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Premium Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowModal(false)} />
                    
                    <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/20 w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Add Partner Company</h3>
                                <p className="text-slate-400 text-sm">Register a new organization for drives.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                <Plus className="rotate-45 h-8 w-8" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-8 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Google, Microsoft..."
                                        value={newCompany.name} 
                                        onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Industry</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. IT Services"
                                        value={newCompany.industry} 
                                        onChange={e => setNewCompany({ ...newCompany, industry: e.target.value })} 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Website URL</label>
                                <input 
                                    type="url" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                    placeholder="https://company.com"
                                    value={newCompany.website} 
                                    onChange={e => setNewCompany({ ...newCompany, website: e.target.value })} 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Description</label>
                                <textarea 
                                    required 
                                    rows="4" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Briefly describe the company and its goals..."
                                    value={newCompany.description} 
                                    onChange={e => setNewCompany({ ...newCompany, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                >
                                    Discard
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                                >
                                    Add Company
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCompanies;
