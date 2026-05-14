import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import api from '../../services/api';

/* ---------- helpers ---------- */
function initials(name) {
    if (!name || typeof name !== 'string') return '?';
    const p = name.trim().split(/\s+/);
    return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() || '?';
}

const TYPE_LABEL = {
    'full-time':  'Full Time',
    'part-time':  'Part Time',
    'contract':   'Contract',
    'internship': 'Internship',
};

const LEVEL_COLORS = {
    entry:  'bg-emerald-50 text-emerald-700 border-emerald-100',
    mid:    'bg-blue-50 text-blue-700 border-blue-100',
    senior: 'bg-purple-50 text-purple-700 border-purple-100',
};

/* ---------- Job card matching template style ---------- */
function JobCard({ job }) {
    const company = job.employer?.name || 'Company';
    const level   = job.experience_level;
    const type    = job.type;

    return (
        <Link
            to={`/jobs/${job.id}`}
            className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 transition-all duration-150 hover:border-brand-200 hover:shadow-card-hover"
        >
            {/* Company logo / initials */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                {initials(company)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                        <p className="text-xs font-medium text-slate-400 mb-0.5">{company}</p>
                        <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                            {job.title}
                        </h3>
                    </div>
                    {job.salary != null && Number(job.salary) > 0 && (
                        <span className="text-sm font-bold text-slate-900 shrink-0">
                            {Number(job.salary).toLocaleString()} <span className="text-xs font-medium text-slate-400">EGP</span>
                        </span>
                    )}
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {job.location && (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                        </span>
                    )}
                    {type && (
                        <span className="inline-flex rounded-full border bg-slate-50 border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            {TYPE_LABEL[type] || type}
                        </span>
                    )}
                    {level && (
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${LEVEL_COLORS[level] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {level}
                        </span>
                    )}
                    {job.category?.name && (
                        <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                            {job.category.name}
                        </span>
                    )}
                </div>
            </div>

            {/* Arrow */}
            <svg className="h-5 w-5 text-slate-300 group-hover:text-brand-500 transition-colors shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Link>
    );
}

/* ---------- Filter sidebar ---------- */
function FilterSidebar({ filters, setFilters, categories }) {
    const types = ['full-time', 'part-time', 'contract', 'internship'];
    const levels = ['entry', 'mid', 'senior'];

    const toggle = (key, val) => {
        setFilters(prev => ({ ...prev, [key]: prev[key] === val ? '' : val }));
    };

    return (
        <aside className="w-full lg:w-56 shrink-0 space-y-6">
            {/* Search */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Search</label>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="search"
                        value={filters.keyword}
                        onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                        placeholder="Job title or keyword"
                        className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                    />
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Location</label>
                <input
                    type="text"
                    value={filters.location}
                    onChange={e => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City or remote"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                />
            </div>

            {/* Job Level */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Level</label>
                <div className="space-y-1.5">
                    {levels.map(l => (
                        <button
                            key={l}
                            type="button"
                            onClick={() => toggle('experience_level', l)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                filters.experience_level === l
                                    ? 'bg-brand-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className={`h-2 w-2 rounded-full ${filters.experience_level === l ? 'bg-white' : 'bg-slate-300'}`} />
                            <span className="capitalize">{l}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Job Type */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Type</label>
                <div className="space-y-1.5">
                    {types.map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => toggle('type', t)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                filters.type === t
                                    ? 'bg-brand-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className={`h-2 w-2 rounded-full ${filters.type === t ? 'bg-white' : 'bg-slate-300'}`} />
                            <span>{TYPE_LABEL[t]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Department</label>
                <div className="space-y-1.5">
                    {categories.map(c => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => toggle('category_id', String(c.id))}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                filters.category_id === String(c.id)
                                    ? 'bg-brand-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <span className={`h-2 w-2 rounded-full ${filters.category_id === String(c.id) ? 'bg-white' : 'bg-slate-300'}`} />
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear */}
            {(filters.keyword || filters.location || filters.experience_level || filters.type || filters.category_id) && (
                <button
                    type="button"
                    onClick={() => setFilters({ keyword: '', location: '', experience_level: '', type: '', category_id: '' })}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                    Clear all filters ×
                </button>
            )}
        </aside>
    );
}

/* ---------- Main page ---------- */
export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        keyword: '', location: '', experience_level: '', type: '', category_id: '',
    });

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data.categories || []));
    }, []);

    const fetchPage = async (page, append) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(null);
        try {
            const params = { page };
            if (filters.keyword.trim()) params.keyword = filters.keyword.trim();
            if (filters.location.trim()) params.location = filters.location.trim();
            if (filters.experience_level) params.experience_level = filters.experience_level;
            if (filters.type) params.type = filters.type;
            if (filters.category_id) params.category_id = filters.category_id;

            const res = await api.get('/jobs', { params });
            const payload = res.data;
            const list = payload.data ?? [];
            setMeta({ current_page: payload.current_page, last_page: payload.last_page, total: payload.total });
            setJobs(prev => append ? [...prev, ...list] : list);
        } catch {
            setError('Could not load jobs. Make sure the API is running.');
            if (!append) setJobs([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Debounce filter changes
    useEffect(() => {
        const t = setTimeout(() => fetchPage(1, false), 350);
        return () => clearTimeout(t);
    }, [filters]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <SiteHeader />

            {/* Hero */}
            <section className="border-b border-slate-100 bg-[#f8f9fc] py-12 sm:py-16">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                        Find your next <span className="text-brand-600">dream job</span>
                    </h1>
                    <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base sm:text-lg">
                        Browse curated opportunities from top companies in tech, design, marketing and more.
                    </p>

                    {/* Quick search bar */}
                    <form
                        onSubmit={e => { e.preventDefault(); fetchPage(1, false); }}
                        className="mt-8 mx-auto max-w-2xl flex items-center gap-2 rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-2"
                    >
                        <svg className="h-5 w-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="search"
                            value={filters.keyword}
                            onChange={e => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
                            placeholder="Job title, company or keyword…"
                            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none py-1.5"
                        />
                        <button type="submit" className="shrink-0 rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
                            Search
                        </button>
                    </form>

                    {/* Category pills */}
                    {categories.length > 0 && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {categories.map(c => (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setFilters(prev => ({ ...prev, category_id: prev.category_id === String(c.id) ? '' : String(c.id) }))}
                                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                                        filters.category_id === String(c.id)
                                            ? 'border-brand-600 bg-brand-600 text-white'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:text-brand-700'
                                    }`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Body: Sidebar + Jobs */}
            <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterSidebar filters={filters} setFilters={setFilters} categories={categories} />

                    {/* Job list */}
                    <div className="flex-1 min-w-0">
                        {error && (
                            <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-slate-500">
                                {loading ? 'Loading…' : <><span className="font-semibold text-slate-900">{meta?.total ?? jobs.length}</span> open positions</>}
                            </p>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />
                                ))}
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                                <svg className="mx-auto h-10 w-10 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p className="text-slate-500 font-medium">No jobs match your filters.</p>
                                <p className="mt-1 text-sm text-slate-400">Try adjusting your search or clearing filters.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    {jobs.map(job => <JobCard key={job.id} job={job} />)}
                                </div>
                                {meta && meta.current_page < meta.last_page && (
                                    <div className="mt-8 flex justify-center">
                                        <button
                                            onClick={() => fetchPage(meta.current_page + 1, true)}
                                            disabled={loadingMore}
                                            className="rounded-xl border border-slate-200 bg-white px-8 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors disabled:opacity-50"
                                        >
                                            {loadingMore ? 'Loading…' : 'Load more jobs'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
