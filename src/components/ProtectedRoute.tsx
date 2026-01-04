import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const password = localStorage.getItem('admin_password');

    if (!password) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;