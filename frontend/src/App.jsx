import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// public pages
import Jobs from './pages/public/Jobs';
import JobDetails from './pages/public/JobDetails';

// employer pages
import EmployerDashboard from './pages/employer/Dashboard';

// candidate pages
import CandidateDashboard from './pages/candidate/Dashboard';

// admin pages
import AdminDashboard from './pages/admin/Dashboard';

const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;

    return children;
};

export default function App() {
    return (
        <Routes>
            {/* public */}
            <Route path="/" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* employer */}
            <Route path="/employer/dashboard" element={
                <ProtectedRoute role="employer">
                    <EmployerDashboard />
                </ProtectedRoute>
            } />

            {/* candidate */}
            <Route path="/candidate/dashboard" element={
                <ProtectedRoute role="candidate">
                    <CandidateDashboard />
                </ProtectedRoute>
            } />

            {/* admin */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin">
                    <AdminDashboard />
                </ProtectedRoute>
            } />
        </Routes>
    );
}