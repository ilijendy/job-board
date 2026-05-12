import { Link } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-card">
                    <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Admin</p>
                    <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Moderation & insights</h1>
                    <p className="mt-3 text-slate-600 max-w-xl">
                        Approve listings and view stats — hook up admin API calls from this screen when you extend the app.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                        ← Back to site
                    </Link>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
