import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../services/api';

const MySwal = withReactContent(Swal);

const STATUS_BADGE = {
    approved: 'bg-emerald-100 text-emerald-700',
    open:     'bg-amber-100 text-amber-700',
    closed:   'bg-red-100 text-red-700',
    paused:   'bg-slate-100 text-slate-700',
};

export default function JobsTable() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    const [error, setError] = useState('');
    const [acting, setActing] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = { page };
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            if (showDeleted) params.show_deleted = 'true';
            
            const res = await api.get('/admin/jobs', { params });
            setJobs(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (err) {
            setError('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchJobs();
        }, 300); // debounce
        return () => clearTimeout(timeoutId);
    }, [page, search, statusFilter, showDeleted]);

    const act = async (jobId, action) => {
        if (action === 'delete') {
            const result = await MySwal.fire({
                title: 'Are you sure?',
                text: "Do you really want to delete this job?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#94a3b8',
                confirmButtonText: 'Yes, delete!'
            });
            if (!result.isConfirmed) return;
        }

        setActing(jobId);
        try {
            if (action === 'delete') {
                await api.delete(`/admin/job/${jobId}`);
                toast.success('Job deleted successfully');
                fetchJobs();
            } else if (action === 'restore') {
                await api.put(`/admin/job/${jobId}/restore`);
                toast.success('Job restored successfully');
                fetchJobs();
            } else {
                await api.put(`/admin/job/${jobId}/${action}`);
                toast.success(`Job ${action}d successfully`);
                setJobs(jobs.map(j => j.id === jobId ? { ...j, status: action === 'approve' ? 'approved' : 'closed' } : j));
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setActing(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-lg">Manage Jobs</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                    <label className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <input type="checkbox" checked={showDeleted} onChange={(e) => { setShowDeleted(e.target.checked); setPage(1); }} className="rounded text-brand-600 focus:ring-brand-500" />
                        Show Deleted
                    </label>
                    <input 
                        type="text" 
                        placeholder="Search jobs by title..." 
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-full sm:w-64"
                    />
                    <select 
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open (Pending)</option>
                        <option value="approved">Approved</option>
                        <option value="closed">Closed (Rejected)</option>
                        <option value="paused">Paused</option>
                    </select>
                </div>
            </div>

            {error && <div className="m-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{error}</div>}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4 border-b border-slate-200">Job Title & Company</th>
                            <th className="px-6 py-4 border-b border-slate-200">Category</th>
                            <th className="px-6 py-4 border-b border-slate-200">Status</th>
                            <th className="px-6 py-4 border-b border-slate-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
                        ) : jobs.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No jobs found</td></tr>
                        ) : (
                            jobs.map(job => (
                                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-900">{job.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{job.employer?.name || 'Unknown'}</p>
                                    </td>
                                    <td className="px-6 py-4">{job.category?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[job.status] || STATUS_BADGE.open}`}>
                                                {job.status === 'open' ? 'Pending' : job.status}
                                            </span>
                                            {job.deleted_at && (
                                                <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700">
                                                    Deleted
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        {!job.deleted_at && job.status === 'open' && (
                                            <>
                                                <button 
                                                    onClick={() => act(job.id, 'approve')}
                                                    disabled={acting === job.id}
                                                    className="text-emerald-600 hover:text-emerald-800 font-medium text-sm disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => act(job.id, 'reject')}
                                                    disabled={acting === job.id}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {job.deleted_at ? (
                                            <button 
                                                onClick={() => act(job.id, 'restore')}
                                                disabled={acting === job.id}
                                                className="text-emerald-600 hover:text-emerald-800 font-medium text-sm disabled:opacity-50 ml-2"
                                            >
                                                {acting === job.id ? 'Restoring...' : 'Restore'}
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => act(job.id, 'delete')}
                                                disabled={acting === job.id}
                                                className="text-slate-400 hover:text-red-600 font-medium text-sm disabled:opacity-50 ml-2"
                                                title="Delete"
                                            >
                                                {acting === job.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
