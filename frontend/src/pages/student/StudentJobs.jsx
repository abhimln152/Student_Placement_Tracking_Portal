import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Briefcase, MapPin, DollarSign, Calendar, GraduationCap } from 'lucide-react';

const StudentJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    setApplyingTo(jobId);
    setMessage('');
    try {
      await api.post(`/applications/apply?userId=${user.id}&jobId=${jobId}`);
      setMessage('Successfully applied to the job!');
    } catch (error) {
      setMessage(error.response?.data || 'Failed to apply. Check your eligibility or if you already applied.');
    } finally {
      setApplyingTo(null);
      setTimeout(() => setMessage(''), 5000); // Clear message after 5s
    }
  };

  if (loading) return <div>Loading available drives...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg shadow-sm">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Current Placement Drives</h3>
        <p className="mt-1 text-sm text-gray-500">Apply to the open positions that match your profile.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.includes('Successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.length === 0 ? (
          <div className="col-span-fulltext-center py-10 bg-white rounded-lg shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No active drives</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white overflow-hidden shadow rounded-lg flex flex-col hover:shadow-md transition-shadow">
              <div className="px-4 py-5 sm:p-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <p className="text-sm font-medium text-primary mt-1">{job.company.name}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {job.status}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {job.packageLpa} LPA
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <GraduationCap className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    Min CGPA: {job.eligibilityCgpa}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 border-t pt-2 mt-2">
                    <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600 line-clamp-3">
                  {job.description}
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={applyingTo === job.id}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${applyingTo === job.id ? 'bg-blue-400' : 'bg-primary hover:bg-blue-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                >
                  {applyingTo === job.id ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentJobs;
