import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import api from '../../services/api';

const MySwal = withReactContent(Swal);

export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    const [error, setError] = useState('');
    const [acting, setActing] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = { page };
            if (search) params.search = search;
            if (roleFilter) params.role = roleFilter;
            if (showDeleted) params.show_deleted = 'true';
            
            const res = await api.get('/admin/users', { params });
            setUsers(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (err) {
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers();
        }, 300); // debounce
        return () => clearTimeout(timeoutId);
    }, [page, search, roleFilter, showDeleted]);

    const handleDelete = async (id) => {
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this user?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, delete!'
        });

        if (!result.isConfirmed) return;

        setActing(id);
        try {
            await api.delete(`/admin/user/${id}`);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setActing(null);
        }
    };

    const handleRestore = async (id) => {
        setActing(id);
        try {
            await api.put(`/admin/user/${id}/restore`);
            toast.success('User restored successfully');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to restore user');
        } finally {
            setActing(null);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <h2 className="font-semibold text-slate-900 text-lg">Manage Users</h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
                    <label className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                        <input type="checkbox" checked={showDeleted} onChange={(e) => { setShowDeleted(e.target.checked); setPage(1); }} className="rounded text-brand-600 focus:ring-brand-500" />
                        Show Deleted
                    </label>
                    <input 
                        type="text"  
                        placeholder="Search users..." 
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-full sm:w-64"
                    />
                    <select 
                        value={roleFilter}
                        onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                    >
                        <option value="">All Roles</option>
                        <option value="candidate">Candidate</option>
                        <option value="employer">Employer</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {error && <div className="m-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">{error}</div>}

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4 border-b border-slate-200">Name</th>
                            <th className="px-6 py-4 border-b border-slate-200">Email</th>
                            <th className="px-6 py-4 border-b border-slate-200">Role</th>
                            <th className="px-6 py-4 border-b border-slate-200 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No users found</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <Link to={`/users/${user.id}`} className="hover:text-brand-600 transition-colors">
                                            {user.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 items-center">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize
                                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                                  user.role === 'employer' ? 'bg-blue-100 text-blue-700' : 
                                                  'bg-emerald-100 text-emerald-700'}`}>
                                                {user.role}
                                            </span>
                                            {user.deleted_at && (
                                                <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700">
                                                    Deleted
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.role !== 'admin' && (
                                            user.deleted_at ? (
                                                <button 
                                                    onClick={() => handleRestore(user.id)}
                                                    disabled={acting === user.id}
                                                    className="text-emerald-600 hover:text-emerald-800 font-medium text-sm disabled:opacity-50"
                                                >
                                                    {acting === user.id ? 'Restoring...' : 'Restore'}
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={acting === user.id}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm disabled:opacity-50"
                                                >
                                                    {acting === user.id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            )
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
