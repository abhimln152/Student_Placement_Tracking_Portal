import React, { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const StudentApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await api.get(`/applications/student/${user.id}`);
        setApplications(response.data);
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchApps();
  }, [user]);

  if (loading) return <div>Loading applications...</div>;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'HIRED': return <CheckCircle className="text-green-500 h-5 w-5" />;
      case 'REJECTED': return <XCircle className="text-red-500 h-5 w-5" />;
      case 'PENDING': return <Clock className="text-yellow-500 h-5 w-5" />;
      case 'SHORTLISTED': return <CheckCircle className="text-blue-500 h-5 w-5" />;
      default: return <FileText className="text-gray-500 h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'HIRED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SHORTLISTED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 rounded-lg shadow-sm">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Application Tracking</h3>
        <p className="mt-1 text-sm text-gray-500">View the status of the companies you have applied to.</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {applications.length === 0 ? (
          <div className="p-10 text-center">
             <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
             <p className="text-gray-500">You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {app.job.company.name.charAt(0)}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-primary truncate">
                        {app.job.company.name} • {app.job.title}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1">{app.status}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        Package: {app.job.packageLpa} LPA
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p>
                        Applied on {new Date(app.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;
