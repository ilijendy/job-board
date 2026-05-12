import { Link } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';

export default function EmployerDashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
                <div className="rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-card">
                    <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Employer</p>
                    <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Your hiring hub</h1>
                    <p className="mt-3 text-slate-600 max-w-xl">
                        Post roles, review applicants, and keep your pipeline organized — wire your API actions here next.
                    </p>
                    <Link
                        to="/"
                        className="mt-8 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                        ← Browse public jobs
                    </Link>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
