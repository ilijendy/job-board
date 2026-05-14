import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import api from '../../services/api';

const STATUS_BADGE = {
    approved: 'bg-emerald-100 text-emerald-700',
    open:     'bg-amber-100 text-amber-700',
    closed:   'bg-red-100 text-red-700',
};

function StatCard({ icon, label, value, color }) {
    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
                <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
        </div>
    );
}

export default function EmployerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/employer/jobs');
            setJobs(res.data.jobs || []);
        } catch {}
        finally { setLoading(false); }
    };

    useEffect(() => { fetchJobs(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job posting?')) return;
        setDeleteId(id);
        try {
            await api.delete(`/employer/job/${id}`);
            setJobs(prev => prev.filter(j => j.id !== id));
        } catch {}
        finally { setDeleteId(null); }
    };

    const approved = jobs.filter(j => j.status === 'approved').length;
    const pending  = jobs.filter(j => j.status === 'open').length;

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fc]">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Employer Hub</p>
                        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Your Hiring Dashboard</h1>
                    </div>
                    <Link
                        to="/employer/post-job"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post a Job
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <StatCard
                        icon={<svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        label="Total Jobs Posted" value={jobs.length} color="bg-brand-50"
                    />
                    <StatCard
                        icon={<svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        label="Approved Listings" value={approved} color="bg-emerald-50"
                    />
                    <StatCard
                        icon={<svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        label="Pending Approval" value={pending} color="bg-amber-50"
                    />
                </div>

                {/* Jobs Table */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-900">Job Listings</h2>
                        <Link to="/employer/profile" className="text-sm text-brand-600 hover:text-brand-700 font-medium">Company Profile →</Link>
                    </div>
                    {loading ? (
                        <div className="p-6 space-y-3">
                            {[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />)}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            <p className="text-slate-500 font-medium">No jobs posted yet.</p>
                            <Link to="/employer/post-job" className="mt-3 inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">Post your first job →</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {jobs.map(job => (
                                <div key={job.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">{job.title}</p>
                                        <p className="text-sm text-slate-500 mt-0.5">{job.location} · {job.type}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[job.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {job.status === 'open' ? 'Pending' : job.status}
                                        </span>
                                        <Link to={`/employer/job/${job.id}/applications`} className="text-xs font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 rounded-lg px-3 py-1.5 hover:bg-brand-50 transition-colors">
                                            Applications
                                        </Link>
                                        <Link to={`/employer/edit-job/${job.id}`} className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            disabled={deleteId === job.id}
                                            className="text-xs font-semibold text-red-600 hover:text-red-700 border border-red-100 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            {deleteId === job.id ? '…' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
