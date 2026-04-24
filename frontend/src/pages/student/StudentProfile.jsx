import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    fullName: '',
    rollNumber: '',
    branch: '',
    batchYear: '',
    cgpa: '',
    skills: '',
    resumeUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/student/profile/${user.id}`);
        setProfile(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load profile details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put(`/student/profile/${user.id}`, profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please check inputs.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6 border-t-4 border-primary">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Ensure your academic details are up-to-date to apply for drives.</p>
        
        {message.text && (
          <div className={`mt-4 p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Roll Number (Read-only)</label>
              <div className="mt-1">
                <input type="text" readOnly disabled value={profile.rollNumber} className="bg-gray-100 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border text-gray-500" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <div className="mt-1">
                <input type="text" name="branch" value={profile.branch} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Batch Year</label>
              <div className="mt-1">
                <input type="number" name="batchYear" value={profile.batchYear} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Current CGPA</label>
              <div className="mt-1">
                <input type="number" step="0.01" max="10" name="cgpa" value={profile.cgpa} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Technical Skills</label>
              <p className="text-xs text-gray-500 mb-1">Comma separated (e.g. Java, React, SQL)</p>
              <div className="mt-1">
                <input type="text" name="skills" value={profile.skills || ''} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>
            
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Resume Link (Google Drive / GitHub)</label>
              <div className="mt-1">
                <input type="url" name="resumeUrl" value={profile.resumeUrl || ''} onChange={handleChange} className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border" />
              </div>
            </div>

          </div>

          <div className="pt-5 flex justify-end">
            <button type="submit" disabled={saving} className={`ml-3 inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white ${saving ? 'bg-blue-400' : 'bg-primary hover:bg-blue-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors`}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
