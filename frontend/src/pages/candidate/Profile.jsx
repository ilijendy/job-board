import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5';

const PREDEFINED_SKILLS = [
    'PHP', 'Laravel', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js',
    'Python', 'Java', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker',
    'AWS', 'Git', 'REST APIs', 'GraphQL', 'CSS', 'Tailwind CSS',
];

function AvatarUploader({ user, onUpload }) {
    const fileRef = useRef();
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const avatarUrl = preview || (user?.avatar ? `http://127.0.0.1:8000/storage/${user.avatar}` : null);
    const initials = (user?.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    const handleFile = async e => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            // Use raw axios (not the api instance) so we don't inherit Content-Type: application/json.
            // The browser will automatically set multipart/form-data with the correct boundary.
            const token = localStorage.getItem('token');
            const res = await axios.post('http://127.0.0.1:8000/api/user/avatar', fd, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            onUpload(res.data.user);
        } catch (err) {
            console.error('Avatar upload failed:', err.response?.data || err.message);
            setPreview(null); // revert preview on failure
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-brand-100">
                    {avatarUrl
                        ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        : <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-400 text-white text-3xl font-bold">{initials}</div>
                    }
                </div>
                <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    disabled={uploading}
                    className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 transition-colors border-2 border-white"
                    title="Change photo"
                >
                    {uploading
                        ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    }
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            <p className="text-xs text-slate-400">JPG, PNG or WebP · max 3 MB</p>
        </div>
    );
}

export default function CandidateProfile() {
    const { user, login } = useAuth();
    const [userForm, setUserForm] = useState({ name: '', phone: '' });
    const [profileForm, setProfileForm] = useState({
        headline: '', bio: '', location: '', experience_years: '',
        linkedin_url: '', predefined_skills: [], custom_skills: [],
    });
    const [customSkillInput, setCustomSkillInput] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeName, setResumeName] = useState('');
    const [currentResume, setCurrentResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const resumeRef = useRef();

    useEffect(() => {
        Promise.all([api.get('/user'), api.get('/candidate/profile')])
            .then(([uRes, pRes]) => {
                const u = uRes.data.user;
                setUserForm({ name: u.name || '', phone: u.phone || '' });
                const p = pRes.data.profile || {};
                setCurrentResume(p.resume_url || null);
                setProfileForm({
                    headline: p.headline || '',
                    bio: p.bio || '',
                    location: p.location || '',
                    experience_years: p.experience_years || '',
                    linkedin_url: p.linkedin_url || '',
                    predefined_skills: Array.isArray(p.predefined_skills) ? p.predefined_skills : [],
                    custom_skills: Array.isArray(p.custom_skills) ? p.custom_skills : [],
                });
            })
            .catch(() => {
                // Profile doesn't exist yet for this user — that's fine, start with defaults
            })
            .finally(() => setLoading(false));
    }, []);

    const toggleSkill = skill => {
        setProfileForm(prev => ({
            ...prev,
            predefined_skills: prev.predefined_skills.includes(skill)
                ? prev.predefined_skills.filter(s => s !== skill)
                : [...prev.predefined_skills, skill],
        }));
    };

    const addCustomSkill = () => {
        const s = customSkillInput.trim();
        if (s && !profileForm.custom_skills.includes(s)) {
            setProfileForm(prev => ({ ...prev, custom_skills: [...prev.custom_skills, s] }));
        }
        setCustomSkillInput('');
    };

    const removeCustomSkill = skill => {
        setProfileForm(prev => ({ ...prev, custom_skills: prev.custom_skills.filter(s => s !== skill) }));
    };

    const handleAvatarUpload = updatedUser => {
        login(updatedUser, localStorage.getItem('token'));
        setSuccess('Profile photo updated!');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleResumeChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        setResumeFile(file);
        setResumeName(file.name);
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) return;
        setUploadingResume(true);
        const fd = new FormData();
        fd.append('resume', resumeFile);
        try {
            const res = await api.post('/candidate/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setCurrentResume(res.data.resume_url);
            setResumeFile(null);
            setResumeName('');
            setSuccess('Resume uploaded!');
            setTimeout(() => setSuccess(''), 3000);
        } catch { setError('Failed to upload resume'); }
        finally { setUploadingResume(false); }
    };

    const handleSave = async e => {
        e.preventDefault();
        setSaving(true); setError(''); setSuccess('');
        try {
            const uRes = await api.put('/user', userForm);
            login(uRes.data.user, localStorage.getItem('token'));

            await api.post('/candidate/profile', {
                ...profileForm,
                // send as arrays (JSON body)
            });
            setSuccess('Profile saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save profile');
        } finally { setSaving(false); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-10">
                {/* Hero */}
                <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-slate-800 via-brand-700 to-brand-500 shadow-xl">
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)'}} />
                    <div className="relative px-6 sm:px-10 py-8 flex flex-col sm:flex-row sm:items-end gap-6">
                        <AvatarUploader user={user} onUpload={handleAvatarUpload} />
                        <div className="text-white">
                            <p className="text-brand-100 text-sm font-semibold uppercase tracking-widest">Candidate Profile</p>
                            <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{user?.name}</h1>
                            <p className="text-brand-100 text-sm mt-0.5">{user?.email}</p>
                            {profileForm.headline && (
                                <p className="mt-2 text-brand-100 text-sm font-medium">{profileForm.headline}</p>
                            )}
                            <div className="mt-3 flex flex-wrap gap-2">
                                {profileForm.predefined_skills.slice(0, 4).map(s => (
                                    <span key={s} className="inline-block rounded-full bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5">{s}</span>
                                ))}
                                {profileForm.predefined_skills.length > 4 && (
                                    <span className="inline-block rounded-full bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5">+{profileForm.predefined_skills.length - 4} more</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {success && <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center gap-2"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{success}</div>}
                {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Personal Info */}
                    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <input value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Phone</label>
                                <input value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className={inputClass} placeholder="+20 10 0000 0000" />
                            </div>
                        </div>
                    </section>

                    {/* Professional Info */}
                    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Professional Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className={labelClass}>Headline</label>
                                <input value={profileForm.headline} onChange={e => setProfileForm({...profileForm, headline: e.target.value})} className={inputClass} placeholder="e.g. Full-Stack Developer with 3 years experience" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Location</label>
                                    <input value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} className={inputClass} placeholder="Cairo, Egypt" />
                                </div>
                                <div>
                                    <label className={labelClass}>Years of Experience</label>
                                    <input type="number" min="0" max="50" value={profileForm.experience_years} onChange={e => setProfileForm({...profileForm, experience_years: e.target.value})} className={inputClass} placeholder="3" />
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>LinkedIn URL</label>
                                <input type="url" value={profileForm.linkedin_url} onChange={e => setProfileForm({...profileForm, linkedin_url: e.target.value})} className={inputClass} placeholder="https://linkedin.com/in/yourname" />
                            </div>
                            <div>
                                <label className={labelClass}>Bio</label>
                                <textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} rows={4} className={inputClass} placeholder="Tell employers about yourself, your background, and what you're looking for…" />
                            </div>
                        </div>
                    </section>

                    {/* Skills */}
                    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                            Skills
                        </h2>

                        <div>
                            <label className={labelClass}>Select your skills</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {PREDEFINED_SKILLS.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill(skill)}
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                                            profileForm.predefined_skills.includes(skill)
                                                ? 'bg-brand-600 border-brand-600 text-white shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700'
                                        }`}
                                    >
                                        {profileForm.predefined_skills.includes(skill) && '✓ '}{skill}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className={labelClass}>Custom Skills</label>
                            <div className="flex gap-2">
                                <input
                                    value={customSkillInput}
                                    onChange={e => setCustomSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                                    className={inputClass}
                                    placeholder="Type a skill and press Enter or Add"
                                />
                                <button type="button" onClick={addCustomSkill} className="shrink-0 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-100 transition-colors">
                                    Add
                                </button>
                            </div>
                            {profileForm.custom_skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {profileForm.custom_skills.map(s => (
                                        <span key={s} className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                                            {s}
                                            <button type="button" onClick={() => removeCustomSkill(s)} className="text-slate-400 hover:text-red-500 transition-colors">×</button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Resume */}
                    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Resume / CV
                        </h2>

                        {currentResume && (
                            <div className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                                <svg className="h-5 w-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-emerald-800">Resume on file</p>
                                    <a href={`http://127.0.0.1:8000/storage/${currentResume}`} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 hover:underline truncate block">{currentResume}</a>
                                </div>
                                <a href={`http://127.0.0.1:8000/storage/${currentResume}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">Download ↗</a>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                            <div
                                className="flex-1 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-colors"
                                onClick={() => resumeRef.current.click()}
                            >
                                <svg className="mx-auto h-8 w-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                <p className="text-sm font-medium text-slate-600">{resumeName || 'Click to select resume'}</p>
                                <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX · max 5 MB</p>
                                <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} />
                            </div>
                            {resumeFile && (
                                <button
                                    type="button"
                                    onClick={handleResumeUpload}
                                    disabled={uploadingResume}
                                    className="shrink-0 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors disabled:opacity-55 flex items-center gap-2"
                                >
                                    {uploadingResume ? <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading…</> : 'Upload'}
                                </button>
                            )}
                        </div>
                    </section>

                    <button type="submit" disabled={saving} className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-55 flex items-center justify-center gap-2">
                        {saving ? (<><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>) : 'Save Profile'}
                    </button>
                </form>
            </main>
            <SiteFooter />
        </div>
    );
}
