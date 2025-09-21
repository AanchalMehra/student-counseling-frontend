// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the route is for admins only and the user is not an admin, redirect to student dashboard
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/student-dashboard" replace />;
  }

  // If the checks pass, render the child component
  return <Outlet />;
};

export default ProtectedRoute;