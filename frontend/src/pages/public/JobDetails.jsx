import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

function Section({ title, children }) {
    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-800">{title}</h2>
            <div className="mt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{children}</div>
        </section>
    );
}

export default function JobDetails() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/jobs/${id}`);
                if (!cancelled) setJob(res.data.job);
            } catch {
                if (!cancelled) {
                    setError('This job could not be found or is no longer available.');
                    setJob(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const company = job?.employer?.name || 'Company';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />

            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 mb-8"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to jobs
                </Link>

                {loading && (
                    <div className="space-y-4">
                        <div className="h-10 w-2/3 rounded-lg bg-slate-200 animate-pulse" />
                        <div className="h-24 rounded-2xl bg-slate-200 animate-pulse" />
                        <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-800">
                        {error}
                    </div>
                )}

                {!loading && job && (
                    <>
                        <header className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-400 text-lg font-bold text-white shadow-sm">
                                    {initials(company)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
                                    <p className="mt-2 text-lg font-medium text-slate-600">{company}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.location && (
                                            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                {job.location}
                                            </span>
                                        )}
                                        {job.type && (
                                            <span className="inline-flex rounded-lg bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                                                {job.type}
                                            </span>
                                        )}
                                        {job.experience_level && (
                                            <span className="inline-flex rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                                                {job.experience_level}
                                            </span>
                                        )}
                                        {job.category?.name && (
                                            <span className="inline-flex rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
                                                {job.category.name}
                                            </span>
                                        )}
                                    </div>
                                    {job.salary != null && Number(job.salary) > 0 && (
                                        <p className="mt-4 text-lg font-semibold text-brand-700">
                                            {Number(job.salary).toLocaleString()} EGP
                                        </p>
                                    )}
                                </div>
                            </div>
                        </header>

                        <div className="mt-8 space-y-6">
                            {job.description && <Section title="About the role">{job.description}</Section>}
                            {job.requirements && <Section title="Requirements">{job.requirements}</Section>}
                            {job.responsibilities && <Section title="Responsibilities">{job.responsibilities}</Section>}
                        </div>

                        <div className="mt-10 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 sm:p-8 text-center text-white shadow-lg">
                            <p className="font-semibold text-lg">Ready to apply?</p>
                            <p className="mt-2 text-sm text-brand-50 max-w-md mx-auto">
                                Sign in as a candidate from the header, then apply from your dashboard when apply flow is
                                connected.
                            </p>
                            <Link
                                to="/register"
                                className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-sm hover:bg-brand-50 transition-colors"
                            >
                                Create candidate account
                            </Link>
                        </div>
                    </>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
