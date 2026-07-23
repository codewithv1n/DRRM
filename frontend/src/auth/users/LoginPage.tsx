import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/residents/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.details || data.error || 'Login failed.');
                return;
            }

            // Save resident data to localStorage
            localStorage.setItem('resident', JSON.stringify(data.resident));

            // Redirect to main page
            navigate('/hazard-evac');

        } catch (err: any) {
            setError('Cannot connect to server. Please make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-100">
                {/* Logo & Heading */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-md shadow-blue-600/20">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                            <path d="M12 7V13L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-slate-800 tracking-tight">Welcome back</h1>
                    <p className="text-[13px] text-slate-400 mt-1">Sign in to your DRRM account</p>
                </div>

                {/* Role Toggle */}
                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 mb-4 shadow-sm">
                    <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-blue-600 text-white text-[13px] font-semibold transition-all duration-200 shadow-sm"
                    >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
                            <path d="M2.5 14C2.5 11.5 5 10 8 10C11 10 13.5 11.5 13.5 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        Resident
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/adminLogin')}
                        className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-transparent text-slate-500 text-[13px] font-medium transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
                            <path d="M5 8H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            <path d="M8 5V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        Staff
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-600 flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
                                <path d="M8 5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                      
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="email" className="text-[13px] font-medium text-slate-600">
                                Email address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                                        <path d="M2 4L8 9L14 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-[13px] font-medium text-slate-600">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                                        <path d="M5.5 7V5C5.5 3.6 6.6 2.5 8 2.5C9.4 2.5 10.5 3.6 10.5 5V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                        <circle cx="8" cy="10.5" r="1" fill="currentColor" />
                                    </svg>
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-10 pl-9 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-[13px] text-slate-800 placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                            <path d="M3.5 5.5C2.3 6.6 1.5 8 1.5 8C1.5 8 4 12.5 8 12.5C9 12.5 9.9 12.2 10.7 11.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                            <path d="M6.5 3.7C7 3.6 7.5 3.5 8 3.5C12 3.5 14.5 8 14.5 8C14.5 8 13.9 9.1 12.8 10.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M1.5 8C1.5 8 4 3.5 8 3.5C12 3.5 14.5 8 14.5 8C14.5 8 12 12.5 8 12.5C4 12.5 1.5 8 1.5 8Z" stroke="currentColor" strokeWidth="1.4" />
                                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
                                        </svg>
                                    )}
                                </button>
                         </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 rounded-lg bg-blue-600 text-white text-[13px] font-semibold transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:active:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>
                </div>

                {/* Sign up link */}
                <p className="text-center text-[13px] text-slate-400 mt-6">
                    Don&apos;t have an account?{' '}
                    <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
