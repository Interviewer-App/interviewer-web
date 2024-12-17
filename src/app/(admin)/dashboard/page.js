import React from 'react';
import ProtectedRoute from '../../../components/shared/ProtectedRoute';

const AdminDashboard = () => {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <h1>Welcome to the Admin Dashboard</h1>
    </ProtectedRoute>
  );
};

export default AdminDashboard;