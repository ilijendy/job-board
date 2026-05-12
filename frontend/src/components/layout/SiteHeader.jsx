import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`;

export default function SiteHeader() {
    const { user, logout } = useAuth();

    const dashPath =
        user?.role === 'employer'
            ? '/employer/dashboard'
            : user?.role === 'admin'
              ? '/admin/dashboard'
              : user?.role === 'candidate'
                ? '/candidate/dashboard'
                : '/';

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-bold shadow-sm">
                        J
                    </span>
                    <span className="font-bold text-slate-900 tracking-tight hidden sm:inline">JobBoard</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/" end className={navClass}>
                        Explore jobs
                    </NavLink>
                    <span className="text-sm font-medium text-slate-400 cursor-default">For employers</span>
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    {user ? (
                        <>
                            <Link
                                to={dashPath}
                                className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-brand-600 px-2"
                            >
                                Hi, {user.name?.split(' ')[0] || 'there'}
                            </Link>
                            <Link
                                to={dashPath}
                                className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
                                aria-label="Dashboard"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                                    />
                                </svg>
                            </Link>
                            <button
                                type="button"
                                onClick={logout}
                                className="text-sm font-medium text-slate-600 hover:text-brand-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-lg transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
