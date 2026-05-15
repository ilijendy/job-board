import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

function initials(name) {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
}

function Section({ title, children }) {
    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-800">{title}</h2>
            <div className="mt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{children}</div>
        </section>
    );
}

function ApplyModal({ job, onClose, onSuccess }) {
    const fileRef = useRef();
    const [coverLetter, setCoverLetter] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeName, setResumeName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async e => {
        e.preventDefault();
        if (!resumeFile) { setError('Please select your resume file.'); return; }
        setLoading(true); setError(null);
        const fd = new FormData();
        fd.append('resume', resumeFile);
        fd.append('cover_letter', coverLetter);
        try {
            await api.post(`/candidate/job/${job.id}/apply`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-100 mb-1">Applying for</p>
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <p className="text-sm text-brand-100">{job.employer?.name}</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Resume / CV *</label>
                        <div
                            className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-colors"
                            onClick={() => fileRef.current.click()}
                        >
                            <svg className="mx-auto h-7 w-7 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <p className="text-sm text-slate-600">{resumeName || 'Click to upload resume'}</p>
                            <p className="text-xs text-slate-400 mt-0.5">PDF, DOC, DOCX</p>
                            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => { setResumeFile(e.target.files[0]); setResumeName(e.target.files[0]?.name || ''); }} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">Cover Letter (optional)</label>
                        <textarea
                            value={coverLetter}
                            onChange={e => setCoverLetter(e.target.value)}
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
                            placeholder="Tell the employer why you're a great fit…"
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-55 flex items-center justify-center gap-2">
                            {loading ? (<><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>) : 'Submit Application'}
                        </button>
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function JobDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApply, setShowApply] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true); setError(null);
            try {
                const res = await api.get(`/jobs/${id}`);
                if (!cancelled) setJob(res.data.job);
            } catch {
                if (!cancelled) { setError('This job could not be found or is no longer available.'); setJob(null); }
            } finally { if (!cancelled) setLoading(false); }
        })();
        return () => { cancelled = true; };
    }, [id]);

    const company = job?.employer?.name || 'Company';

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />

            <main className="flex-1 mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
                <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 mb-8">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
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
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center text-red-800">{error}</div>
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
                                    <Link to={`/users/${job.employer_id}`} className="mt-2 inline-block text-lg font-medium text-slate-600 hover:text-brand-600 transition-colors">
                                        {company}
                                    </Link>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {job.location && <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{job.location}</span>}
                                        {job.type && <span className="inline-flex rounded-lg bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">{job.type}</span>}
                                        {job.experience_level && <span className="inline-flex rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">{job.experience_level}</span>}
                                        {job.category?.name && <span className="inline-flex rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">{job.category.name}</span>}
                                    </div>
                                    {job.salary != null && Number(job.salary) > 0 && (
                                        <p className="mt-4 text-lg font-semibold text-brand-700">{Number(job.salary).toLocaleString()} EGP / month</p>
                                    )}
                                    {job.application_deadline && (
                                        <p className="mt-1 text-xs text-slate-400">Deadline: {new Date(job.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    )}
                                </div>
                            </div>
                        </header>

                        <div className="mt-8 space-y-6">
                            {job.description && <Section title="About the role">{job.description}</Section>}
                            {job.requirements && <Section title="Requirements">{job.requirements}</Section>}
                            {job.responsibilities && <Section title="Responsibilities">{job.responsibilities}</Section>}
                        </div>

                        {/* Apply CTA */}
                        <div className="mt-10 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 sm:p-8 text-center text-white shadow-lg">
                            {applied ? (
                                <>
                                    <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <p className="font-bold text-xl">Application Submitted!</p>
                                    <p className="mt-2 text-sm text-brand-100">You can track your application status in your dashboard.</p>
                                    <Link to="/candidate/dashboard" className="mt-5 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50 transition-colors">
                                        View Dashboard →
                                    </Link>
                                </>
                            ) : user?.role === 'candidate' ? (
                                <>
                                    <p className="font-semibold text-lg">Ready to apply?</p>
                                    <p className="mt-2 text-sm text-brand-100 max-w-md mx-auto">Upload your resume and add an optional cover letter to apply now.</p>
                                    <button
                                        onClick={() => setShowApply(true)}
                                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-brand-700 shadow-sm hover:bg-brand-50 transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Apply Now
                                    </button>
                                </>
                            ) : user?.role === 'employer' || user?.role === 'admin' ? (
                                <>
                                    <p className="font-semibold text-lg">This listing looks great!</p>
                                    <p className="mt-2 text-sm text-brand-100">Only candidates can apply for jobs.</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-semibold text-lg">Interested in this role?</p>
                                    <p className="mt-2 text-sm text-brand-100 max-w-md mx-auto">Create a free candidate account to apply in minutes.</p>
                                    <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link to="/register" className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-sm hover:bg-brand-50 transition-colors">
                                            Create account
                                        </Link>
                                        <Link to="/login" className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors">
                                            Log in
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </main>

            <SiteFooter />

            {showApply && job && (
                <ApplyModal
                    job={job}
                    onClose={() => setShowApply(false)}
                    onSuccess={() => { setShowApply(false); setApplied(true); }}
                />
            )}
        </div>
    );
}
