import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor' | 'viewer';
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user) {
    const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };
    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      // User doesn't have required permissions
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}
