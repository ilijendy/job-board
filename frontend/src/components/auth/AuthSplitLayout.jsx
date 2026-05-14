import { Link } from 'react-router-dom';

export default function AuthSplitLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left panel — matches template's blue sidebar */}
            <aside className="relative lg:w-[45%] min-h-[200px] lg:min-h-screen overflow-hidden bg-brand-600">
                {/* Subtle dot pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px',
                    }}
                />
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px] lg:min-h-screen p-8 lg:p-12 text-white">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                            <svg className="h-4.5 w-4.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 7h-4V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v2H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zm-9-2a1 1 0 011-1h2a1 1 0 011 1v2h-4V5zm8 14H5V9h14v10z"/>
                            </svg>
                        </div>
                        <span className="text-lg font-bold tracking-tight">JobBoard</span>
                    </Link>

                    {/* Main copy */}
                    <div className="hidden lg:block max-w-sm">
                        <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-3">
                            Careers, simplified
                        </p>
                        <h2 className="text-3xl xl:text-4xl font-bold leading-tight">
                            Find the job that's right for you.
                        </h2>
                        <p className="mt-4 text-blue-100/90 text-sm leading-relaxed">
                            Thousands of curated roles from top companies. Apply in minutes.
                        </p>

                        {/* Stats */}
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {[
                                { num: '500+', label: 'Open roles' },
                                { num: '200+', label: 'Top companies' },
                            ].map(s => (
                                <div key={s.label} className="rounded-xl bg-white/10 px-4 py-3">
                                    <p className="text-2xl font-bold">{s.num}</p>
                                    <p className="text-blue-100 text-xs mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-blue-100/60 text-xs">© {new Date().getFullYear()} JobBoard</p>
                </div>
            </aside>

            {/* Right panel — clean white form */}
            <main className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                        {subtitle && <p className="mt-2 text-slate-500 text-sm leading-relaxed">{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}
