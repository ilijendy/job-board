import { Link } from 'react-router-dom';

export default function AuthSplitLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <aside className="relative lg:w-[42%] min-h-[220px] lg:min-h-screen overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800">
                <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px] lg:min-h-screen p-8 lg:p-12 text-white">
                    <Link to="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25 text-lg font-bold">
                            J
                        </span>
                        <span className="text-lg">JobBoard</span>
                    </Link>
                    <div className="hidden lg:block max-w-md">
                        <p className="text-brand-100 text-sm font-medium uppercase tracking-widest mb-3">
                            Careers, simplified
                        </p>
                        <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
                            The place where talent meets opportunity.
                        </h1>
                        <p className="mt-4 text-brand-100/90 text-base leading-relaxed">
                            Search curated roles, apply in one flow, and grow your career — inspired by the clarity of
                            modern job platforms.
                        </p>
                    </div>
                    <p className="text-brand-200/80 text-xs lg:text-sm">
                        Trusted by teams hiring across Egypt and beyond.
                    </p>
                </div>
            </aside>

            <main className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-slate-50">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                        {subtitle && <p className="mt-2 text-slate-600 text-sm leading-relaxed">{subtitle}</p>}
                    </div>
                    <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-card border border-slate-100/80">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
