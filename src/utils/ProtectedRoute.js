import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { hasPermission } from './auth';

const ProtectedRoute = ({ isAuthenticated, permission, redirectPath = '/dashboard', children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (permission && !hasPermission(permission)) {
    console.warn(`Access denied: lack of permission "${permission}". Redirecting.`);
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;