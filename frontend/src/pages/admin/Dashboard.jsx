import { useEffect, useState } from 'react';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import UsersTable from '../../components/admin/UsersTable';
import JobsTable from '../../components/admin/JobsTable';
import api from '../../services/api';

const STATUS_BADGE = {
    approved: 'bg-emerald-100 text-emerald-700',
    open:     'bg-amber-100 text-amber-700',
    closed:   'bg-red-100 text-red-700',
};

function StatCard({ icon, label, value, color, bg }) {
    return (
        <div className={`rounded-2xl ${bg} border border-slate-200/50 p-5 flex items-center gap-4`}>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 shadow-sm ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, pendingRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/pending-jobs'),
            ]);
            setStats(statsRes.data);
            setPending(pendingRes.data.jobs || []);
        } catch { setError('Failed to load admin data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const act = async (jobId, action) => {
        setActing(jobId);
        try {
            await api.put(`/admin/job/${jobId}/${action}`);
            setPending(prev => prev.filter(j => j.id !== jobId));
            setStats(prev => prev ? {
                ...prev,
                pending_jobs: prev.pending_jobs - 1,
                approved_jobs: action === 'approve' ? prev.approved_jobs + 1 : prev.approved_jobs,
            } : prev);
        } catch { setError('Action failed'); }
        finally { setActing(null); }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Admin Panel</p>
                        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">Moderation & Insights</h1>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Overview</button>
                        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Users</button>
                        <button onClick={() => setActiveTab('jobs')} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Jobs</button>
                    </div>
                </div>

                {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

                {activeTab === 'overview' && (
                    <>
                        {/* Stats */}
                        {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                            label="Total Users" value={stats.total_users} color="text-brand-600" bg="bg-brand-50" />
                        <StatCard icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>}
                            label="Employers" value={stats.total_employers} color="text-purple-600" bg="bg-purple-50" />
                        <StatCard icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                            label="Candidates" value={stats.total_candidates} color="text-blue-600" bg="bg-blue-50" />
                        <StatCard icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                            label="Total Jobs" value={stats.total_jobs} color="text-slate-600" bg="bg-slate-100" />
                        <StatCard icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            label="Pending Approval" value={stats.pending_jobs} color="text-amber-600" bg="bg-amber-50" />
                        <StatCard icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            label="Approved Jobs" value={stats.approved_jobs} color="text-emerald-600" bg="bg-emerald-50" />
                        <StatCard icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                            label="Applications" value={stats.total_applications} color="text-indigo-600" bg="bg-indigo-50" />
                    </div>
                )}

                {/* Pending Jobs */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-900">Pending Job Approvals</h2>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-2.5 py-1">{pending.length} waiting</span>
                    </div>

                    {loading ? (
                        <div className="p-6 space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />)}</div>
                    ) : pending.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <svg className="mx-auto h-12 w-12 text-emerald-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <p className="text-slate-500 font-medium">All caught up! No jobs waiting for approval.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {pending.map(job => (
                                <div key={job.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-slate-900 truncate">{job.title}</p>
                                            <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 shrink-0">Pending</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-0.5">
                                            {job.employer?.name} · {job.location} · {job.type}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {job.category?.name} · Posted {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => act(job.id, 'approve')}
                                            disabled={acting === job.id}
                                            className="text-sm font-semibold text-emerald-700 border border-emerald-200 rounded-xl px-4 py-2 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                        >
                                            {acting === job.id ? '…' : '✓ Approve'}
                                        </button>
                                        <button
                                            onClick={() => act(job.id, 'reject')}
                                            disabled={acting === job.id}
                                            className="text-sm font-semibold text-red-600 border border-red-200 rounded-xl px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            {acting === job.id ? '…' : '✕ Reject'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                </>)}

                {activeTab === 'users' && <UsersTable />}
                
                {activeTab === 'jobs' && <JobsTable />}
            </main>
            <SiteFooter />
        </div>
    );
}
