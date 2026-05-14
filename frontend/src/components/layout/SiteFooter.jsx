import { Link } from 'react-router-dom';

export default function SiteFooter() {
    return (
        <footer className="border-t border-slate-100 bg-white mt-auto">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600">
                                <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 7h-4V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v2H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zm-9-2a1 1 0 011-1h2a1 1 0 011 1v2h-4V5zm8 14H5V9h14v10z"/>
                                </svg>
                            </div>
                            <span className="font-bold text-slate-900">JobBoard</span>
                        </div>
                        <p className="text-sm text-slate-400">Curated jobs for the best talent.</p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">Find Jobs</Link>
                        <Link to="/employer/post-job" className="text-slate-500 hover:text-slate-900 transition-colors">Post a Job</Link>
                        <Link to="/login" className="text-slate-500 hover:text-slate-900 transition-colors">Log in</Link>
                        <Link to="/register" className="text-slate-500 hover:text-slate-900 transition-colors">Register</Link>
                    </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                    <p>© {new Date().getFullYear()} JobBoard. All rights reserved.</p>
                    <p>Built with Laravel & React</p>
                </div>
            </div>
        </footer>
    );
}
