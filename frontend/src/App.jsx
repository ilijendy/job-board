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
import PostJob from './pages/employer/PostJob';
import EditJob from './pages/employer/EditJob';
import JobApplications from './pages/employer/JobApplications';
import EmployerProfile from './pages/employer/Profile';

// candidate pages
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateProfile from './pages/candidate/Profile';

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
                <ProtectedRoute role="employer"><EmployerDashboard /></ProtectedRoute>
            } />
            <Route path="/employer/post-job" element={
                <ProtectedRoute role="employer"><PostJob /></ProtectedRoute>
            } />
            <Route path="/employer/edit-job/:id" element={
                <ProtectedRoute role="employer"><EditJob /></ProtectedRoute>
            } />
            <Route path="/employer/job/:id/applications" element={
                <ProtectedRoute role="employer"><JobApplications /></ProtectedRoute>
            } />
            <Route path="/employer/profile" element={
                <ProtectedRoute role="employer"><EmployerProfile /></ProtectedRoute>
            } />

            {/* candidate */}
            <Route path="/candidate/dashboard" element={
                <ProtectedRoute role="candidate"><CandidateDashboard /></ProtectedRoute>
            } />
            <Route path="/candidate/profile" element={
                <ProtectedRoute role="candidate"><CandidateProfile /></ProtectedRoute>
            } />

            {/* admin */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
        </Routes>
    );
}