import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Phone, Send } from 'lucide-react';

const Support = () => {
  const [formData, setFormData] = useState({
    category: 'Technical Issue',
    subject: '',
    message: '',
  });
  const [success, setSuccess] = useState('');

  const faqs = [
    {
      q: 'I cannot log in. What should I do?',
      a: 'Verify your email and password first. If the problem continues, contact your placement admin to reset your account.',
    },
    {
      q: 'Why can I not apply for a job?',
      a: 'Make sure your profile is complete and your CGPA meets job eligibility criteria.',
    },
    {
      q: 'How often are application statuses updated?',
      a: 'Statuses are updated by admins after review rounds. Refresh the Applications page to see the latest state.',
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('Your support request has been recorded. Our team will contact you soon.');
    setFormData({ category: 'Technical Issue', subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          Support Center
        </h2>
        <p className="text-gray-600 mt-2">
          Need help with login, profiles, job applications, or status updates? Use the help resources below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Channels</h3>
          <div className="space-y-4 text-sm text-gray-700">
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@placementportal.edu</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 98765 43210</p>
            <p className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Mon-Fri, 10:00 AM to 6:00 PM</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit a Support Request</h3>

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md p-3">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Technical Issue</option>
                <option>Account/Login Issue</option>
                <option>Profile Update Issue</option>
                <option>Application Tracking Issue</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter a short subject"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Describe your issue in detail"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
            >
              <Send className="h-4 w-4" />
              Submit Request
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqs.map((item) => (
            <div key={item.q} className="border border-gray-200 rounded-md p-4">
              <p className="font-medium text-gray-800">{item.q}</p>
              <p className="text-sm text-gray-600 mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
