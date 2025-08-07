// src/features/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Loading authentication status...</p>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
