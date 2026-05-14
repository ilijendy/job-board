import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const STATUS_CONFIG = {
    pending:   { label: 'Pending',   color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400' },
    reviewed:  { label: 'Reviewed',  color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-400' },
    accepted:  { label: 'Accepted',  color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
    rejected:  { label: 'Rejected',  color: 'bg-red-100 text-red-700',       dot: 'bg-red-400' },
    cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-300' },
};

export default function CandidateDashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(null);

    useEffect(() => {
        api.get('/candidate/applications').then(res => {
            setApplications(res.data.applications || []);
        }).finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this application?')) return;
        setCancelling(id);
        try {
            await api.delete(`/candidate/application/${id}`);
            setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
        } catch {}
        finally { setCancelling(null); }
    };

    const counts = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
        active: applications.filter(a => !['cancelled', 'rejected'].includes(a.status)).length,
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Candidate Hub</p>
                        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">
                            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/candidate/profile" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                            <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            My Profile
                        </Link>
                        <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors">
                            Browse Jobs →
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Applied', value: counts.total, color: 'text-brand-600', bg: 'bg-brand-50' },
                        { label: 'Pending Review', value: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Accepted', value: counts.accepted, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Active', value: counts.active, color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map(s => (
                        <div key={s.label} className={`rounded-2xl ${s.bg} border border-slate-200/50 p-4 text-center`}>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Applications */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-900">My Applications</h2>
                    </div>
                    {loading ? (
                        <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}</div>
                    ) : applications.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            <p className="text-slate-500 font-medium">No applications yet.</p>
                            <Link to="/" className="mt-3 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">Browse open jobs →</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {applications.map(app => {
                                const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                                return (
                                    <div key={app.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                                <p className="font-semibold text-slate-900 truncate">{app.job?.title || 'Unknown Job'}</p>
                                            </div>
                                            <p className="text-sm text-slate-500 mt-0.5 ml-4">
                                                {app.job?.employer?.name || 'Company'} · {app.job?.location || ''}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5 ml-4">
                                                Applied {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-4">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cfg.color}`}>
                                                {cfg.label}
                                            </span>
                                            <Link to={`/jobs/${app.job_id}`} className="text-xs font-semibold text-slate-600 hover:text-brand-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-brand-200 transition-colors">
                                                View Job
                                            </Link>
                                            {app.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancel(app.id)}
                                                    disabled={cancelling === app.id}
                                                    className="text-xs font-semibold text-red-600 hover:text-red-700 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                >
                                                    {cancelling === app.id ? '…' : 'Cancel'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
