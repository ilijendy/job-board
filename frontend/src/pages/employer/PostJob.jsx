import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import api from '../../services/api';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5';

export default function PostJob() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        title: '', description: '', requirements: '', responsibilities: '',
        location: '', type: 'full-time', experience_level: 'mid',
        salary: '', application_deadline: '', category_id: '',
    });

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data.categories || []));
    }, []);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            await api.post('/employer/job', form);
            navigate('/employer/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || Object.values(err.response?.data?.errors || {}).flat().join(', ') || 'Failed to post job');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-10">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">New Listing</p>
                    <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Post a Job</h1>
                </div>

                {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
                    <div>
                        <label className={labelClass}>Job Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="e.g. Senior Laravel Developer" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Category *</label>
                            <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass} required>
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Job Type *</label>
                            <select name="type" value={form.type} onChange={handleChange} className={inputClass} required>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Location *</label>
                            <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Cairo · Hybrid" required />
                        </div>
                        <div>
                            <label className={labelClass}>Experience Level</label>
                            <select name="experience_level" value={form.experience_level} onChange={handleChange} className={inputClass}>
                                <option value="entry">Entry</option>
                                <option value="mid">Mid</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Salary (EGP / month)</label>
                            <input type="number" name="salary" value={form.salary} onChange={handleChange} className={inputClass} placeholder="25000" min="0" />
                        </div>
                        <div>
                            <label className={labelClass}>Application Deadline</label>
                            <input type="date" name="application_deadline" value={form.application_deadline} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Job Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={5} className={inputClass} placeholder="Describe the role, team, and mission…" required />
                    </div>

                    <div>
                        <label className={labelClass}>Requirements</label>
                        <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={4} className={inputClass} placeholder="Skills, qualifications, experience needed…" />
                    </div>

                    <div>
                        <label className={labelClass}>Responsibilities</label>
                        <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} rows={4} className={inputClass} placeholder="Day-to-day tasks and ownership areas…" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-55">
                            {loading ? 'Submitting…' : 'Submit for Approval'}
                        </button>
                        <button type="button" onClick={() => navigate('/employer/dashboard')} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
            <SiteFooter />
        </div>
    );
}
