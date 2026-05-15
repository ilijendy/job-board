import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import api from '../../services/api';

const STATUS_COLORS = {
    pending:  'bg-amber-100 text-amber-700',
    reviewed: 'bg-blue-100 text-blue-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
};

function initials(name) {
    if (!name) return '?';
    return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function JobApplications() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get(`/jobs/${id}`),
            api.get(`/employer/job/${id}/applications`),
        ]).then(([jobRes, appRes]) => {
            setJob(jobRes.data.job);
            setApplications(appRes.data.applications || []);
        }).catch(() => setError('Failed to load applications')).finally(() => setLoading(false));
    }, [id]);

    const updateStatus = async (appId, status) => {
        setUpdating(appId);
        try {
            await api.put(`/employer/job/${id}/application/${appId}/status`, { status });
            setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
        } catch { setError('Failed to update status'); }
        finally { setUpdating(null); }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-10">
                <Link to="/employer/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 mb-6">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to Dashboard
                </Link>

                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Applications</p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900">{job?.title || 'Loading…'}</h1>
                    <p className="text-slate-500 text-sm mt-1">{applications.length} application{applications.length !== 1 ? 's' : ''}</p>
                </div>

                {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

                {loading ? (
                    <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-slate-200 animate-pulse" />)}</div>
                ) : applications.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                        <p className="text-slate-500 font-medium">No applications yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map(app => (
                            <div key={app.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    {/* Avatar */}
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-400 text-white font-bold text-sm">
                                        {initials(app.candidate?.name)}
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Link to={`/users/${app.candidate?.id}`} className="font-semibold text-slate-900 hover:text-brand-600 transition-colors">
                                                {app.candidate?.name || 'Candidate'}
                                            </Link>
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_COLORS[app.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-0.5">{app.candidate?.email}</p>
                                        {app.cover_letter && (
                                            <p className="mt-3 text-sm text-slate-700 line-clamp-2 italic">"{app.cover_letter}"</p>
                                        )}
                                        {app.resume && (
                                            <a
                                                href={`http://127.0.0.1:8000/storage/${app.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                View Resume
                                            </a>
                                        )}
                                    </div>
                                    {/* Actions */}
                                    <div className="flex gap-2 shrink-0">
                                        {['reviewed', 'accepted', 'rejected'].map(s => (
                                            <button
                                                key={s}
                                                onClick={() => updateStatus(app.id, s)}
                                                disabled={app.status === s || updating === app.id}
                                                className={`text-xs font-semibold rounded-lg px-3 py-1.5 border transition-colors disabled:opacity-40 ${
                                                    s === 'accepted' ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                                    : s === 'rejected' ? 'border-red-200 text-red-700 hover:bg-red-50'
                                                    : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                                                } ${app.status === s ? 'opacity-40 cursor-default' : ''}`}
                                            >
                                                {updating === app.id ? '…' : s.charAt(0).toUpperCase() + s.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <SiteFooter />
        </div>
    );
}
