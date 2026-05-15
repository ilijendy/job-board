import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function AvatarImg({ user }) {
    const initials = (user?.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    if (user?.avatar) {
        return (
            <img
                src={`http://127.0.0.1:8000/storage/${user.avatar}`}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100"
            />
        );
    }
    return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-300 overflow-hidden relative ring-2 ring-slate-100">
            <svg className="w-7 h-7 absolute -bottom-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        </span>
    );
}

export default function SiteHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const dashPath =
        user?.role === 'employer' ? '/employer/dashboard'
        : user?.role === 'admin' ? '/admin/dashboard'
        : user?.role === 'candidate' ? '/candidate/dashboard'
        : '/';

    const profilePath =
        user?.role === 'employer' ? '/employer/profile'
        : user?.role === 'candidate' ? '/candidate/profile'
        : null;

    const handleLogout = async () => {
        try { await api.post('/logout'); } catch {}
        logout();
        navigate('/');
    };

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'}`;

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
            <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 7h-4V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v2H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zm-9-2a1 1 0 011-1h2a1 1 0 011 1v2h-4V5zm8 14H5V9h14v10z"/>
                        </svg>
                    </div>
                    <span className="font-bold text-slate-900 text-base tracking-tight hidden sm:inline">JobBoard</span>
                </Link>

                {/* Center nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink to="/" end className={navLinkClass}>Find Jobs</NavLink>
                    {user?.role === 'employer' && <>
                        <NavLink to="/employer/dashboard" className={navLinkClass}>My Jobs</NavLink>
                        <NavLink to="/employer/job/0/applications" className={({ isActive }) => `text-sm font-medium text-slate-600 hover:text-slate-900`}>Applications</NavLink>
                    </>}
                    {user?.role === 'candidate' && <>
                        <NavLink to="/candidate/dashboard" className={navLinkClass}>My Applications</NavLink>
                    </>}
                    {user?.role === 'admin' && <>
                        <NavLink to="/admin/dashboard" className={navLinkClass}>Admin Panel</NavLink>
                    </>}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-2">
                            {/* Avatar & name */}
                            {profilePath ? (
                                <Link to={profilePath} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors">
                                    <AvatarImg user={user} />
                                    <span className="hidden sm:inline text-sm font-medium text-slate-700 max-w-[120px] truncate">{user.name?.split(' ')[0]}</span>
                                </Link>
                            ) : (
                                <Link to={dashPath} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50">
                                    <AvatarImg user={user} />
                                </Link>
                            )}

                            {/* Employer: Post a Job button */}
                            {user?.role === 'employer' && (
                                <Link to="/employer/post-job" className="hidden sm:inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
                                    + Post a Job
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-50"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors">
                                Log in
                            </Link>
                            <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
                                Register
                            </Link>
                            <Link to="/employer/post-job" className="hidden sm:inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                                Post a job
                            </Link>
                        </div>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {menuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-lg">
                    <Link to="/" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Find Jobs</Link>
                    {user?.role === 'employer' && <>
                        <Link to="/employer/dashboard" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>My Jobs</Link>
                        <Link to="/employer/post-job" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Post a Job</Link>
                        <Link to="/employer/profile" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Company Profile</Link>
                    </>}
                    {user?.role === 'candidate' && <>
                        <Link to="/candidate/dashboard" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>My Applications</Link>
                        <Link to="/candidate/profile" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>My Profile</Link>
                    </>}
                    {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                    )}
                    {!user && <>
                        <Link to="/login" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Log in</Link>
                        <Link to="/register" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Register</Link>
                        <Link to="/employer/post-job" className="block py-2.5 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Post a job</Link>
                    </>}
                </div>
            )}
        </header>
    );
}
