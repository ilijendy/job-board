import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import api from '../../services/api';

function initials(name) {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] || '';
    const b = parts[1]?.[0] || '';
    return (a + b).toUpperCase() || a.toUpperCase();
}

function JobRow({ job }) {
    const company = job.employer?.name || 'Company';
    const category = job.category?.name;

    return (
        <article className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:border-brand-200 hover:shadow-card-hover">
            <Link to={`/jobs/${job.id}`} className="absolute inset-0 rounded-2xl" aria-label={`View ${job.title}`} />
            <div className="relative flex gap-4 sm:gap-5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 text-sm font-bold text-white shadow-sm">
                    {initials(company)}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                    <h2 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-brand-700 transition-colors pr-6">
                        {job.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 font-medium">{company}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {job.location && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.location}
                            </span>
                        )}
                        {job.type && (
                            <span className="inline-flex rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">
                                {job.type}
                            </span>
                        )}
                        {job.experience_level && (
                            <span className="inline-flex rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
                                {job.experience_level}
                            </span>
                        )}
                        {category && (
                            <span className="inline-flex rounded-md border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                                {category}
                            </span>
                        )}
                    </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 text-right shrink-0">
                    {job.salary != null && Number(job.salary) > 0 && (
                        <span className="text-sm font-semibold text-brand-700 whitespace-nowrap">
                            {Number(job.salary).toLocaleString()} EGP
                        </span>
                    )}
                    <span className="text-xs font-medium text-brand-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        View role
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState(null);

    const fetchPage = async (page, append) => {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(null);
        try {
            const res = await api.get('/jobs', {
                params: {
                    page,
                    keyword: keyword.trim() || undefined,
                    location: location.trim() || undefined,
                },
            });
            const payload = res.data;
            const list = payload.data ?? [];
            setMeta({
                current_page: payload.current_page,
                last_page: payload.last_page,
                total: payload.total,
            });
            setJobs((prev) => (append ? [...prev, ...list] : list));
        } catch {
            setError('We could not load jobs. Check that the API is running.');
            if (!append) setJobs([]);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPage(1, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- initial listing only
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPage(1, false);
    };

    const loadMore = () => {
        if (!meta || meta.current_page >= meta.last_page) return;
        fetchPage(meta.current_page + 1, true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />

            <section className="relative overflow-hidden border-b border-brand-100/50 bg-gradient-to-b from-brand-50 via-white to-slate-50">
                <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/30 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 top-40 h-56 w-56 rounded-full bg-brand-300/20 blur-3xl" />
                <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-12 pb-14 sm:pt-16 sm:pb-18">
                    <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-700/90">
                        Thousands of opportunities
                    </p>
                    <h1 className="mt-3 text-center text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight max-w-3xl mx-auto leading-[1.15]">
                        Find the job that fits your life
                    </h1>
                    <p className="mt-4 text-center text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
                        Search by role or city. Clear listings, quick apply — a calmer way to browse openings.
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="mt-10 mx-auto max-w-3xl flex flex-col sm:flex-row gap-3 rounded-2xl bg-white p-3 shadow-card border border-slate-100"
                    >
                        <div className="flex-1 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 border border-transparent focus-within:border-brand-200 focus-within:bg-white transition-colors">
                            <svg className="h-5 w-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="search"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Job title, keywords, or company"
                                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                        <div className="flex-1 sm:max-w-[220px] flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 border border-transparent focus-within:border-brand-200 focus-within:bg-white transition-colors">
                            <svg className="h-5 w-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City or remote"
                                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="shrink-0 rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors sm:min-w-[120px]"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </section>

            <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 rounded-2xl bg-slate-200/60 animate-pulse" />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                        <p className="text-slate-600 font-medium">No jobs match your search yet.</p>
                        <p className="mt-2 text-sm text-slate-500">Try different keywords or check back soon.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-slate-600">
                                <span className="font-semibold text-slate-900">{meta?.total ?? jobs.length}</span>{' '}
                                open positions
                            </p>
                        </div>
                        <ul className="space-y-4">
                            {jobs.map((job) => (
                                <li key={job.id}>
                                    <JobRow job={job} />
                                </li>
                            ))}
                        </ul>
                        {meta && meta.current_page < meta.last_page && (
                            <div className="mt-10 flex justify-center">
                                <button
                                    type="button"
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700 transition-colors disabled:opacity-50"
                                >
                                    {loadingMore ? 'Loading…' : 'Load more'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
