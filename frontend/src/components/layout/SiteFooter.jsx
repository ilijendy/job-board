import { Link } from 'react-router-dom';

export default function SiteFooter() {
    return (
        <footer className="border-t border-slate-200 bg-white mt-auto">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                <p>© {new Date().getFullYear()} JobBoard. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link to="/login" className="hover:text-brand-600 transition-colors">
                        Log in
                    </Link>
                    <Link to="/register" className="hover:text-brand-600 transition-colors">
                        Create account
                    </Link>
                </div>
            </div>
        </footer>
    );
}
