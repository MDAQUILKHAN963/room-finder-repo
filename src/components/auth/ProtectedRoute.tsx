import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

export function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center min-h-[50vh]">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
