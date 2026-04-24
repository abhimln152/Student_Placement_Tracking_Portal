import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, Building, Plus } from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    company_id: '',
    title: '',
    description: '',
    packageLpa: '',
    eligibilityCgpa: '',
    deadline: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, compRes] = await Promise.all([
        api.get('/jobs/all'), // Admin gets all (open and closed)
        api.get('/admin/companies')
      ]);
      setJobs(jobsRes.data);
      setCompanies(compRes.data);
    } catch (error) {
      console.error("Error fetching admin jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
        // Need to pass the company object matching the backend relation mapping
        const company = companies.find(c => c.id.toString() === newJob.company_id);
        const payload = {
            ...newJob,
            company: company
        };
        await api.post('/jobs', payload);
        setShowModal(false);
        fetchData();
    } catch (error) {
        alert("Failed to create job posting");
    }
  };

  const toggleJobStatus = async (id, currentStatus) => {
      const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
      try {
          await api.patch(`/jobs/${id}/status?status=${newStatus}`);
          fetchData();
      } catch (error) {
          alert("Failed to update status");
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg shadow-sm flex justify-between items-center">
        <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Job Postings</h3>
            <p className="mt-1 text-sm text-gray-500">Create, close, or view placement drives.</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800"
        >
            <Plus className="mr-2 h-4 w-4" /> New Drive
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <li key={job.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary truncate">{job.title}</p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                            <Building className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {job.company.name}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {job.status}
                        </span>
                        <button 
                            onClick={() => toggleJobStatus(job.id, job.status)}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Mark {job.status === 'OPEN' ? 'Closed' : 'Open'}
                        </button>
                    </div>
                </div>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                  <h3 className="text-lg font-bold mb-4">Post New Drive</h3>
                  <form onSubmit={handleCreateJob} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Company</label>
                          <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={e => setNewJob({...newJob, company_id: e.target.value})}>
                              <option value="">Select Company</option>
                              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Job Title</label>
                          <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={e => setNewJob({...newJob, title: e.target.value})} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-gray-700">Package (LPA)</label>
                              <input type="number" step="0.1" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={e => setNewJob({...newJob, packageLpa: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-gray-700">Min CGPA</label>
                              <input type="number" step="0.01" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={e => setNewJob({...newJob, eligibilityCgpa: e.target.value})} />
                          </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700">Deadline</label>
                          <input type="datetime-local" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" onChange={e => setNewJob({...newJob, deadline: e.target.value})} />
                      </div>
                      <div className="flex justify-end space-x-3 mt-6">
                          <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md text-gray-700">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">Create Post</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminJobs;
