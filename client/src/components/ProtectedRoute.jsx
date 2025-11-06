import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Loading from '../components/Loading';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuthStore();

  if (loading) {
    return <Loading message="Verifying authentication..." />;
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
