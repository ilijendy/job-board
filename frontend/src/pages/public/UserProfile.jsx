import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import api from '../../services/api';

export default function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setUser(res.data.user);
            } catch (err) {
                setError('User not found or an error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-24 w-24 bg-slate-200 rounded-full mb-4"></div>
                        <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    </div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <SiteHeader />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
                        <p className="text-slate-500 mb-6">{error}</p>
                        <Link to="/" className="text-brand-600 hover:text-brand-700 font-medium">Return Home</Link>
                    </div>
                </main>
                <SiteFooter />
            </div>
        );
    }

    const isEmployer = user.role === 'employer';
    const isCandidate = user.role === 'candidate';
    const profile = isEmployer ? user.employer_profile : user.candidate_profile;
    const initials = (user.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            
            <main className="flex-1">
                {/* Header Section */}
                <div className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
                        {user.avatar ? (
                            <img 
                                src={user.avatar_url} 
                                alt={user.name} 
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg shrink-0"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg shrink-0 bg-slate-100 text-slate-300 flex items-center justify-center overflow-hidden relative">
                                <svg className="w-28 h-28 absolute -bottom-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        )}
                        <div className="text-center md:text-left flex-1">
                            <div className="inline-flex items-center gap-2 mb-2">
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize
                                    ${isEmployer ? 'bg-purple-100 text-purple-700' : 
                                      isCandidate ? 'bg-emerald-100 text-emerald-700' : 
                                      'bg-blue-100 text-blue-700'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                            {profile?.company_name && (
                                <p className="text-lg text-slate-600 mt-1">{profile.company_name}</p>
                            )}
                            
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-slate-500">
                                {profile?.website && (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                        Website
                                    </a>
                                )}
                                {profile?.skills && (
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        {profile.skills.split(',').length} Skills
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            <section className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">About</h2>
                                <div className="prose prose-slate prose-sm max-w-none">
                                    {profile?.bio ? (
                                        <p className="whitespace-pre-line text-slate-600">{profile.bio}</p>
                                    ) : (
                                        <p className="text-slate-400 italic">No bio provided.</p>
                                    )}
                                </div>
                            </section>

                            {isEmployer && user.jobs && user.jobs.length > 0 && (
                                <section className="space-y-4">
                                    <h2 className="text-lg font-bold text-slate-900">Open Positions</h2>
                                    <div className="grid gap-4">
                                        {user.jobs.map(job => (
                                            <Link key={job.id} to={`/jobs/${job.id}`} className="bg-white rounded-xl border border-slate-200/60 p-5 hover:border-brand-300 hover:shadow-md transition-all group">
                                                <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">{job.title}</h3>
                                                <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                                                    <span>{job.location || 'Remote'}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{job.type.replace('-', ' ')}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {isCandidate && profile?.skills && (
                                <section className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                                    <h2 className="text-lg font-bold text-slate-900 mb-4">Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.split(',').map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {isCandidate && profile?.experience_level && (
                                <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Experience</h3>
                                    <p className="text-slate-600 capitalize">{profile.experience_level} Level</p>
                                </div>
                            )}

                            {isCandidate && profile?.resume && (
                                <div className="bg-brand-50 rounded-2xl border border-brand-100 p-6 text-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-brand-600">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <h3 className="font-semibold text-slate-900 mb-2">Resume Available</h3>
                                    <p className="text-sm text-slate-500 mb-4">Download the resume to see detailed qualifications.</p>
                                    <a 
                                        href={profile.resume_url || `http://localhost:8000/storage/${profile.resume}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                                    >
                                        Download Resume
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
