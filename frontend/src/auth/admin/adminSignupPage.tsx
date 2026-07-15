import { useState } from "react";
import { Link } from 'react-router-dom';

export default function AdminSignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-[400px]">
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

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
          <form className="flex flex-col gap-5">
            {/* Email */}
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
                <a href="#" className="text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                  Forgot password?
                </a>
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
              className="w-full h-10 rounded-lg bg-blue-600 text-white text-[13px] font-semibold transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98]"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          
        </div>

        {/*Log-in  link */}
        <p className="text-center text-[13px] text-slate-400 mt-6">
          You have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
