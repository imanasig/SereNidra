import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-12 w-12 animate-spin text-violet-600" />
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
