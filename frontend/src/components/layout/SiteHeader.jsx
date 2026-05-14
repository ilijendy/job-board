import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const navClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`;

function AvatarImg({ user, size = 9 }) {
    const initials = (user?.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    if (user?.avatar) {
        return (
            <img
                src={`http://127.0.0.1:8000/storage/${user.avatar}`}
                alt={user.name}
                className={`h-${size} w-${size} rounded-full object-cover border-2 border-brand-200`}
            />
        );
    }
    return (
        <span className={`flex h-${size} w-${size} items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white text-xs font-bold`}>
            {initials}
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

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold shadow-sm">J</span>
                    <span className="font-bold text-slate-900 tracking-tight hidden sm:inline">JobBoard</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    <NavLink to="/" end className={navClass}>Explore jobs</NavLink>
                    {user?.role === 'employer' && (
                        <>
                            <NavLink to="/employer/dashboard" className={navClass}>My Jobs</NavLink>
                            <NavLink to="/employer/post-job" className={navClass}>Post a Job</NavLink>
                        </>
                    )}
                    {user?.role === 'candidate' && (
                        <NavLink to="/candidate/dashboard" className={navClass}>My Applications</NavLink>
                    )}
                    {user?.role === 'admin' && (
                        <NavLink to="/admin/dashboard" className={navClass}>Admin Panel</NavLink>
                    )}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {user ? (
                        <div className="flex items-center gap-2">
                            {profilePath && (
                                <Link to={profilePath} className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-50 transition-colors">
                                    <AvatarImg user={user} size={8} />
                                    <span className="hidden sm:inline text-sm font-medium text-slate-700">{user.name?.split(' ')[0]}</span>
                                </Link>
                            )}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-sm font-medium text-slate-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-lg transition-colors">
                                Log in
                            </Link>
                            <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors">
                                Register
                            </Link>
                        </>
                    )}
                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
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
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
                    <Link to="/" className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Explore jobs</Link>
                    {user?.role === 'employer' && (
                        <>
                            <Link to="/employer/dashboard" className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>My Jobs</Link>
                            <Link to="/employer/post-job" className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Post a Job</Link>
                            <Link to="/employer/profile" className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Company Profile</Link>
                        </>
                    )}
                    {user?.role === 'candidate' && (
                        <>
                            <Link to="/candidate/dashboard" className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>My Applications</Link>
                            <Link to="/candidate/profile" className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>My Profile</Link>
                        </>
                    )}
                    {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" className="block py-2 text-sm font-medium text-slate-700 hover:text-brand-600" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
                    )}
                </div>
            )}
        </header>
    );
}
