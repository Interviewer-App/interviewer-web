
import React from 'react';
import ProtectedRoute from '../../../components/shared/ProtectedRoute';

const CandidateDashboard = () => {
  return (
    <ProtectedRoute allowedRoles={['CLIENT']}>
      <h1>Welcome to Your Candidate Dashboard</h1>
    </ProtectedRoute>
  );
};

export default CandidateDashboard;