import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        // Redirect to their appropriate dashboard if unauthorized for this route
        return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
