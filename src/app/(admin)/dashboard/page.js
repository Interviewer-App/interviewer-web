import ProtectedRoute from '../../../components/shared/ProtectedRoute';

const AdminDashboard = () => {
  return (
    <ProtectedRoute allowedRoles={['COMPANY']}>
      <h1>Welcome to the COMPANY Dashboard</h1>
    </ProtectedRoute>
  );
};

export default AdminDashboard;