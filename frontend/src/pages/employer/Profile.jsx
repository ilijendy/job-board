import { useEffect, useRef, useState } from 'react';
import SiteHeader from '../../components/layout/SiteHeader';
import SiteFooter from '../../components/layout/SiteFooter';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20';
const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5';

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
            const res = await api.post('/user/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            onUpload(res.data.user);
        } catch {}
        finally { setUploading(false); }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {avatarUrl
                        ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                        : <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand-600 to-brand-400 text-white text-3xl font-bold">{initials}</div>
                    }
                </div>
                <button
                    type="button"
                    onClick={() => fileRef.current.click()}
                    className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white shadow-md hover:bg-brand-700 transition-colors border-2 border-white"
                    disabled={uploading}
                    title="Change photo"
                >
                    {uploading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            <p className="text-xs text-slate-400">JPG, PNG or WebP · max 3 MB</p>
        </div>
    );
}

export default function EmployerProfile() {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState(null);
    const [userForm, setUserForm] = useState({ name: '', phone: '' });
    const [companyForm, setCompanyForm] = useState({ company_name: '', company_description: '', website: '', location: '', industry: '' });
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const logoRef = useRef();

    useEffect(() => {
        Promise.all([api.get('/user'), api.get('/employer/profile')])
            .then(([uRes, pRes]) => {
                const u = uRes.data.user;
                setUserForm({ name: u.name || '', phone: u.phone || '' });
                const p = pRes.data.profile || {};
                setProfile(p);
                setCompanyForm({
                    company_name: p.company_name || '',
                    company_description: p.company_description || '',
                    website: p.website || '',
                    location: p.location || '',
                    industry: p.industry || '',
                });
            })
            .catch(() => {
                // No profile yet — start with empty defaults
            })
            .finally(() => setLoading(false));
    }, []);

    const handleAvatarUpload = (updatedUser) => {
        login(updatedUser, localStorage.getItem('token'));
        setSuccess('Profile photo updated!');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleSave = async e => {
        e.preventDefault();
        setSaving(true); setError(''); setSuccess('');
        try {
            // Update user info
            const uRes = await api.put('/user', userForm);
            login(uRes.data.user, localStorage.getItem('token'));

            // Update company profile
            const fd = new FormData();
            Object.entries(companyForm).forEach(([k, v]) => fd.append(k, v || ''));
            if (logoFile) fd.append('company_logo', logoFile);
            await api.post('/employer/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

            setSuccess('Profile saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save profile');
        } finally { setSaving(false); }
    };

    const handleLogoChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

    const logoSrc = logoPreview || (profile?.company_logo ? `http://127.0.0.1:8000/storage/${profile.company_logo}` : null);

    return (
        <div className="min-h-screen flex flex-col bg-[#f8f9fc]">
            <SiteHeader />
            <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-10">
                {/* Hero banner */}
                <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-400 shadow-xl">
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
                    <div className="relative px-6 sm:px-10 py-8 flex flex-col sm:flex-row sm:items-end gap-6">
                        <AvatarUploader user={user} onUpload={handleAvatarUpload} />
                        <div className="text-white">
                            <p className="text-brand-100 text-sm font-semibold uppercase tracking-widest">Employer Account</p>
                            <h1 className="mt-1 text-2xl sm:text-3xl font-bold">{user?.name}</h1>
                            <p className="text-brand-100 text-sm mt-1">{user?.email}</p>
                            {companyForm.industry && <span className="mt-2 inline-block rounded-full bg-white/20 text-white text-xs font-semibold px-3 py-1">{companyForm.industry}</span>}
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

                    {/* Company Info */}
                    <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-card">
                        <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                            <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            Company Profile
                        </h2>

                        {/* Logo Upload */}
                        <div className="mb-5 flex items-center gap-5">
                            <div className="h-16 w-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                                {logoSrc
                                    ? <img src={logoSrc} alt="Logo" className="h-full w-full object-cover" />
                                    : <svg className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg>
                                }
                            </div>
                            <div>
                                <button type="button" onClick={() => logoRef.current.click()} className="text-sm font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 rounded-xl px-4 py-2 hover:bg-brand-50 transition-colors">
                                    {logoSrc ? 'Change Logo' : 'Upload Logo'}
                                </button>
                                <p className="text-xs text-slate-400 mt-1">PNG, JPG · max 2 MB</p>
                                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Company Name *</label>
                                <input value={companyForm.company_name} onChange={e => setCompanyForm({...companyForm, company_name: e.target.value})} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Industry</label>
                                <input value={companyForm.industry} onChange={e => setCompanyForm({...companyForm, industry: e.target.value})} className={inputClass} placeholder="Technology, Finance…" />
                            </div>
                            <div>
                                <label className={labelClass}>Location</label>
                                <input value={companyForm.location} onChange={e => setCompanyForm({...companyForm, location: e.target.value})} className={inputClass} placeholder="Cairo, Egypt" />
                            </div>
                            <div>
                                <label className={labelClass}>Website</label>
                                <input type="url" value={companyForm.website} onChange={e => setCompanyForm({...companyForm, website: e.target.value})} className={inputClass} placeholder="https://yourcompany.com" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className={labelClass}>Company Description</label>
                            <textarea value={companyForm.company_description} onChange={e => setCompanyForm({...companyForm, company_description: e.target.value})} rows={4} className={inputClass} placeholder="Tell candidates about your company, mission, and culture…" />
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
