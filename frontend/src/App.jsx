import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminJobs from './pages/admin/AdminJobs';

// ... (imports)

// Inside Routes:
// Inside Routes: (Deleted)
import AdminDrives from './pages/admin/AdminDrives';
import AdminApplications from './pages/admin/AdminApplications';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import EligibleDrives from './pages/student/EligibleDrives';
import MyApplications from './pages/student/MyApplications';
import Profile from './pages/student/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>

            {/* Admin Routes */}
            <Route element={<PrivateRoute roles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/drives" element={<AdminDrives />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
            </Route>

            {/* Student Routes */}
            <Route element={<PrivateRoute roles={['student']} />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/drives" element={<EligibleDrives />} />
              <Route path="/student/applications" element={<MyApplications />} />
              <Route path="/student/profile" element={<Profile />} />
            </Route>

          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}



export default App;
