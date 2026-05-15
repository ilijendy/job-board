import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthSplitLayout from '../../components/auth/AuthSplitLayout';
import api from '../../services/api';

const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/25';

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'candidate',
    });
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});

        try {
            const res = await api.post('/auth/register', form);
            const { user, access_token: token } = res.data;
            login(user, token);

            if (user.role === 'employer') navigate('/employer/dashboard');
            else if (user.role === 'candidate') navigate('/candidate/dashboard');
            else navigate('/');
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                setFieldErrors(data.errors);
            } else {
                setError(data?.message || 'Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthSplitLayout
            title="Create your account"
            subtitle="Join as a job seeker or employer and get started in minutes."
        >
            {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                    {error}
                </div>
            )}
            {Object.keys(fieldErrors).length > 0 && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <ul className="space-y-1">
                        {Object.entries(fieldErrors).map(([field, messages]) =>
                            messages.map((msg, i) => (
                                <li key={`${field}-${i}`} className="flex items-start gap-2">
                                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v3a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
                                    <span><span className="font-semibold capitalize">{field.replace('_', ' ')}</span>: {msg}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        Full name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`${inputClass} ${fieldErrors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                        autoComplete="name"
                        required
                    />
                    {fieldErrors.name && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.name[0]}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`${inputClass} ${fieldErrors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                        autoComplete="email"
                        required
                    />
                    {fieldErrors.email && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.email[0]}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className={`${inputClass} pr-11 ${fieldErrors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {fieldErrors.password && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password[0]}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        Confirm password
                    </label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        className={`${inputClass} ${fieldErrors.password_confirmation ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                    />
                    {fieldErrors.password_confirmation && <p className="mt-1.5 text-xs text-red-600">{fieldErrors.password_confirmation[0]}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
                        I am a…
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: 'candidate' })}
                            className={`rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                                form.role === 'candidate'
                                    ? 'border-brand-600 bg-brand-50 text-brand-800 shadow-sm'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            Job seeker
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: 'employer' })}
                            className={`rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                                form.role === 'employer'
                                    ? 'border-brand-600 bg-brand-50 text-brand-800 shadow-sm'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                            Employer
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-55"
                >
                    {loading ? 'Creating account…' : 'Create account'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
                    Log in
                </Link>
            </p>
        </AuthSplitLayout>
    );
}
